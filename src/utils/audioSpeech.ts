/**
 * VajraYield Audio Speech & Vernacular TTS Engine
 * Provides dual-engine audio playback:
 * 1. High-fidelity HTML5 Audio Stream (Google TTS) — works on all OS/browsers without requiring local voice packs
 * 2. Web Speech API fallback (SpeechSynthesis) — offline fallback with voice selection
 */

interface PlayAudioOptions {
  text: string;
  lang?: string; // 'kn', 'kn-IN', 'hi', 'hi-IN', 'mr', 'mr-IN', 'en', 'en-IN'
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  rate?: number;
}

let activeAudio: HTMLAudioElement | null = null;
let activeAudioQueue: string[] = [];
let activeQueueIndex = 0;
let isCurrentlyPlaying = false;
let currentPlayId = 0; // Monotonic token to guarantee single voice assistant execution
let currentOnEndCallback: (() => void) | null = null;
let currentOnErrorCallback: ((err: any) => void) | null = null;

/**
 * Split long text into manageable sentences/chunks for URL safety (< 180 chars)
 */
function splitTextIntoChunks(text: string, maxLen = 170): string[] {
  // Normalize whitespaces and remove symbol characters that confuse TTS engines
  const clean = text
    .replace(/₹/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= maxLen) return [clean];

  // Split by sentence terminators: . ? ! । | \n
  const sentences = clean.split(/(?<=[.?!।|\n])\s+/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + " " + sentence).trim().length <= maxLen) {
      currentChunk = (currentChunk + " " + sentence).trim();
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = "";
      }
      // If single sentence is still larger than maxLen, split by commas or words
      if (sentence.length > maxLen) {
        const parts = sentence.split(/(?<=[,;،])\s+/);
        for (const part of parts) {
          if ((currentChunk + " " + part).trim().length <= maxLen) {
            currentChunk = (currentChunk + " " + part).trim();
          } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = part.trim();
          }
        }
      } else {
        currentChunk = sentence.trim();
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks.filter((c) => c.length > 0);
}

/**
 * Normalizes language codes to Google TTS format
 */
function getTtsLangCode(lang: string): string {
  const l = lang.toLowerCase();
  if (l.startsWith("kn") || l.includes("kannada") || l.includes("tulu") || l === "en") return "kn";
  if (l.startsWith("hi") || l.includes("hindi")) return "hi";
  if (l.startsWith("mr") || l.includes("marathi")) return "mr";
  return "kn";
}

/**
 * Fallback to browser SpeechSynthesis
 */
function playSpeechSynthesisFallback(
  text: string,
  lang: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void,
  rate = 0.95
) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    onError?.(new Error("Speech synthesis not supported"));
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    const langCode = lang.startsWith("hi")
      ? "hi-IN"
      : lang.startsWith("mr")
      ? "mr-IN"
      : "kn-IN";
    utter.lang = langCode;
    utter.rate = rate;

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices() || [];
    const matchedVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith("kn") ||
        v.name.toLowerCase().includes("kannada") ||
        v.lang.toLowerCase().startsWith("hi")
    );

    if (matchedVoice) {
      utter.voice = matchedVoice;
    }

    utter.onstart = () => {
      isCurrentlyPlaying = true;
      onStart?.();
    };

    utter.onend = () => {
      isCurrentlyPlaying = false;
      onEnd?.();
    };

    utter.onerror = (e) => {
      isCurrentlyPlaying = false;
      onError?.(e);
    };

    window.speechSynthesis.speak(utter);
  } catch (err) {
    isCurrentlyPlaying = false;
    onError?.(err);
  }
}

/**
 * Stop any active audio / speech synthesis playback completely
 */
export function stopVernacularAudio() {
  currentPlayId++;
  isCurrentlyPlaying = false;
  activeAudioQueue = [];
  activeQueueIndex = 0;

  if (activeAudio) {
    try {
      activeAudio.onended = null;
      activeAudio.onerror = null;
      activeAudio.onplay = null;
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio.removeAttribute("src");
      activeAudio.load();
    } catch {
      // ignore
    }
    activeAudio = null;
  }

  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }

  if (currentOnEndCallback) {
    const cb = currentOnEndCallback;
    currentOnEndCallback = null;
    cb();
  }
}

/**
 * Play high-quality vernacular speech with guaranteed single-voice concurrency
 */
export function playVernacularAudio({
  text,
  lang = "kn",
  onStart,
  onEnd,
  onError,
  rate = 1.0,
}: PlayAudioOptions) {
  // Always stop previous voice immediately
  stopVernacularAudio();

  if (!text || !text.trim()) {
    onEnd?.();
    return;
  }

  const thisPlayId = ++currentPlayId;
  const ttsLang = getTtsLangCode(lang);
  const chunks = splitTextIntoChunks(text);

  if (chunks.length === 0) {
    onEnd?.();
    return;
  }

  isCurrentlyPlaying = true;
  currentOnEndCallback = onEnd || null;
  currentOnErrorCallback = onError || null;

  activeAudioQueue = chunks;
  activeQueueIndex = 0;

  onStart?.();

  function playNextChunk() {
    // If another play request started or user stopped, abort
    if (thisPlayId !== currentPlayId || !isCurrentlyPlaying) return;

    if (activeQueueIndex >= activeAudioQueue.length) {
      isCurrentlyPlaying = false;
      if (thisPlayId === currentPlayId) {
        currentOnEndCallback?.();
        currentOnEndCallback = null;
      }
      return;
    }

    const chunk = activeAudioQueue[activeQueueIndex];
    const encoded = encodeURIComponent(chunk);
    const audioUrl = `/api/tts?tl=${ttsLang}&q=${encoded}`;

    try {
      if (activeAudio) {
        activeAudio.onended = null;
        activeAudio.onerror = null;
        activeAudio.pause();
      }

      const audio = new Audio(audioUrl);
      activeAudio = audio;
      audio.playbackRate = rate;

      audio.onended = () => {
        if (thisPlayId !== currentPlayId) return;
        activeQueueIndex++;
        playNextChunk();
      };

      audio.onerror = () => {
        if (thisPlayId !== currentPlayId) return;
        console.warn("Proxy audio failed, attempting fallback Web Speech");
        const remainingText = activeAudioQueue.slice(activeQueueIndex).join(" ");
        playSpeechSynthesisFallback(
          remainingText,
          lang,
          undefined,
          () => {
            if (thisPlayId === currentPlayId) {
              isCurrentlyPlaying = false;
              currentOnEndCallback?.();
              currentOnEndCallback = null;
            }
          },
          (err) => {
            if (thisPlayId === currentPlayId) {
              isCurrentlyPlaying = false;
              currentOnErrorCallback?.(err);
              currentOnErrorCallback = null;
            }
          }
        );
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (thisPlayId !== currentPlayId) return;
          console.warn("Audio play() prevented, attempting fallback:", err);
          const remainingText = activeAudioQueue.slice(activeQueueIndex).join(" ");
          playSpeechSynthesisFallback(
            remainingText,
            lang,
            undefined,
            () => {
              if (thisPlayId === currentPlayId) {
                isCurrentlyPlaying = false;
                currentOnEndCallback?.();
                currentOnEndCallback = null;
              }
            },
            (err) => {
              if (thisPlayId === currentPlayId) {
                isCurrentlyPlaying = false;
                currentOnErrorCallback?.(err);
                currentOnErrorCallback = null;
              }
            }
          );
        });
      }
    } catch {
      if (thisPlayId !== currentPlayId) return;
      playSpeechSynthesisFallback(
        text,
        lang,
        undefined,
        () => {
          if (thisPlayId === currentPlayId) {
            isCurrentlyPlaying = false;
            currentOnEndCallback?.();
            currentOnEndCallback = null;
          }
        },
        (err) => {
          if (thisPlayId === currentPlayId) {
            isCurrentlyPlaying = false;
            currentOnErrorCallback?.(err);
            currentOnErrorCallback = null;
          }
        }
      );
    }
  }

  playNextChunk();
}

/**
 * Check if speech is actively playing
 */
export function isVernacularAudioPlaying(): boolean {
  return isCurrentlyPlaying;
}


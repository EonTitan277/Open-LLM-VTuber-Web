import type { KeyboardEvent as ReactKeyboardEvent } from "react";

export const MIC_TOGGLE_SHORTCUT_KEY = "appMicToggleShortcut";
export const PROACTIVE_SPEAK_TOGGLE_SHORTCUT_KEY =
  "appProactiveSpeakToggleShortcut";

const MODIFIER_KEYS = new Set(["Control", "Alt", "Shift", "Meta"]);

const MAIN_CODE_MAP: Record<string, string> = {
  Space: "Space",
  Enter: "Enter",
  Tab: "Tab",
  Escape: "Esc",
  Backspace: "Backspace",
  Delete: "Delete",
  ArrowUp: "Up",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  Home: "Home",
  End: "End",
  PageUp: "PageUp",
  PageDown: "PageDown",
  Insert: "Insert",
  CapsLock: "CapsLock",
  Minus: "-",
  Equal: "=",
  BracketLeft: "[",
  BracketRight: "]",
  Backslash: "\\",
  Semicolon: ";",
  Quote: "'",
  Comma: ",",
  Period: ".",
  Slash: "/",
  Backquote: "`",
};

const MAIN_KEY_MAP: Record<string, string> = {
  " ": "Space",
  Escape: "Esc",
  Enter: "Enter",
  Tab: "Tab",
  Backspace: "Backspace",
  Delete: "Delete",
  ArrowUp: "Up",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  Home: "Home",
  End: "End",
  PageUp: "PageUp",
  PageDown: "PageDown",
  Insert: "Insert",
  CapsLock: "CapsLock",
};

const normalizeMainKey = (
  event: ReactKeyboardEvent<HTMLInputElement>,
): string | null => {
  if (event.code.startsWith("Key")) {
    return event.code.slice(3);
  }

  if (event.code.startsWith("Digit")) {
    return event.code.slice(5);
  }

  if (event.code.startsWith("Numpad")) {
    return event.code.slice(6);
  }

  if (MAIN_CODE_MAP[event.code]) {
    return MAIN_CODE_MAP[event.code];
  }

  const { key } = event;

  if (MAIN_KEY_MAP[key]) {
    return MAIN_KEY_MAP[key];
  }

  if (/^F\d{1,2}$/u.test(key)) {
    return key.toUpperCase();
  }

  if (key.length === 1) {
    return key.toUpperCase();
  }

  return null;
};

export const loadInitialMicShortcut = (): string => {
  try {
    return window.localStorage.getItem(MIC_TOGGLE_SHORTCUT_KEY)?.trim() ?? "";
  } catch (error) {
    console.error("Failed to load microphone shortcut:", error);
    return "";
  }
};

export const loadInitialProactiveSpeakShortcut = (): string => {
  try {
    return (
      window.localStorage
        .getItem(PROACTIVE_SPEAK_TOGGLE_SHORTCUT_KEY)
        ?.trim() ?? ""
    );
  } catch (error) {
    console.error("Failed to load proactive speak shortcut:", error);
    return "";
  }
};

export const getShortcutFromKeyboardEvent = (
  event: ReactKeyboardEvent<HTMLInputElement>,
): string | null => {
  if (event.repeat || MODIFIER_KEYS.has(event.key)) {
    return null;
  }

  const mainKey = normalizeMainKey(event);
  if (!mainKey) {
    return null;
  }

  const modifiers: string[] = [];
  if (event.ctrlKey || event.metaKey) {
    modifiers.push("CommandOrControl");
  }
  if (event.altKey) {
    modifiers.push("Alt");
  }
  if (event.shiftKey) {
    modifiers.push("Shift");
  }

  if (modifiers.length > 3) {
    return null;
  }

  return [...modifiers, mainKey].join("+");
};

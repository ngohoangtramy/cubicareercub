import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dutchTranslations, vietnameseTranslations } from "./translations";

export type Language = "en" | "vi" | "nl";

const STORAGE_KEY = "cubi-language";
const dictionaries: Record<Exclude<Language, "en">, Record<string, string>> = {
  vi: vietnameseTranslations,
  nl: dutchTranslations,
};

const languageLabels: Record<Language, { short: string; full: string }> = {
  en: { short: "EN", full: "English" },
  vi: { short: "VI", full: "Tiếng Việt" },
  nl: { short: "NL", full: "Nederlands" },
};

function translateDynamic(text: string, language: Exclude<Language, "en">) {
  const number = "(\\d+)";
  const rules: Array<[RegExp, (...matches: string[]) => string]> =
    language === "vi"
      ? [
          [new RegExp(`^${number} skills tracked$`), (count) => `Đang theo dõi ${count} kỹ năng`],
          [new RegExp(`^Used in ${number} course(?:s)?$`), (count) => `Được dùng trong ${count} khóa học`],
          [new RegExp(`^Step ${number} of ${number}$`), (current, total) => `Bước ${current} trên ${total}`],
          [new RegExp(`^Requested in ${number}% of matching jobs$`), (count) => `Xuất hiện trong ${count}% việc làm phù hợp`],
          [new RegExp(`^${number} course(?:s)?$`), (count) => `${count} khóa học`],
          [new RegExp(`^${number} skill(?:s)?$`), (count) => `${count} kỹ năng`],
          [new RegExp(`^${number} update(?:s)?$`), (count) => `${count} cập nhật`],
          [/^Remove (.+)$/, (name) => `Xóa ${name}`],
          [/^Detected (.+) in the project files or description\.$/, (terms) => `Đã phát hiện ${terms} trong tệp dự án hoặc phần mô tả.`],
          [/^(.+) was linked manually with mastery (\d)\/5 and an assessment score of (\d+)%\.$/, (title, mastery, score) => `${title} được liên kết thủ công với mức thành thạo ${mastery}/5 và điểm đánh giá ${score}%.`],
          [/^(.+) was linked manually with mastery (\d)\/5\.$/, (title, mastery) => `${title} được liên kết thủ công với mức thành thạo ${mastery}/5.`],
          [/^(.+) scored (\d+)% relevance and (\d+)% estimated skill impact\.$/, (title, relevance, impact) => `${title} đạt ${relevance}% độ liên quan và ${impact}% tác động kỹ năng ước tính.`],
          [/^(Course|Video|Book|Bootcamp|Workshop|Self-study) from (.+)\.$/, (type, provider) => `${dictionaries[language][type] ?? type} từ ${provider}.`],
          [/^Open (.+)$/, (name) => `Mở ${name}`],
          [/^(.+) marked (.+)\.$/, (name, status) => `${name} được đánh dấu ${status}.`],
          [/^(.+) was updated by the user\.$/, (name) => `${name} đã được người dùng cập nhật.`],
          [/^(.+) → (.+)$/, (from, to) => `${from} → ${to}`],
        ]
      : [
          [new RegExp(`^${number} skills tracked$`), (count) => `${count} vaardigheden gevolgd`],
          [new RegExp(`^Used in ${number} course(?:s)?$`), (count) => `Gebruikt in ${count} vak${count === "1" ? "" : "ken"}`],
          [new RegExp(`^Step ${number} of ${number}$`), (current, total) => `Stap ${current} van ${total}`],
          [new RegExp(`^Requested in ${number}% of matching jobs$`), (count) => `Gevraagd in ${count}% van passende vacatures`],
          [new RegExp(`^${number} course(?:s)?$`), (count) => `${count} vak${count === "1" ? "" : "ken"}`],
          [new RegExp(`^${number} skill(?:s)?$`), (count) => `${count} vaardigheid${count === "1" ? "" : "en"}`],
          [new RegExp(`^${number} update(?:s)?$`), (count) => `${count} update${count === "1" ? "" : "s"}`],
          [/^Remove (.+)$/, (name) => `${name} verwijderen`],
          [/^Detected (.+) in the project files or description\.$/, (terms) => `${terms} gevonden in de projectbestanden of beschrijving.`],
          [/^(.+) was linked manually with mastery (\d)\/5 and an assessment score of (\d+)%\.$/, (title, mastery, score) => `${title} is handmatig gekoppeld met beheersing ${mastery}/5 en een beoordelingsscore van ${score}%.`],
          [/^(.+) was linked manually with mastery (\d)\/5\.$/, (title, mastery) => `${title} is handmatig gekoppeld met beheersing ${mastery}/5.`],
          [/^(.+) scored (\d+)% relevance and (\d+)% estimated skill impact\.$/, (title, relevance, impact) => `${title} scoorde ${relevance}% relevantie en ${impact}% geschatte vaardigheidsimpact.`],
          [/^(Course|Video|Book|Bootcamp|Workshop|Self-study) from (.+)\.$/, (type, provider) => `${dictionaries[language][type] ?? type} van ${provider}.`],
          [/^Open (.+)$/, (name) => `${name} openen`],
          [/^(.+) marked (.+)\.$/, (name, status) => `${name} gemarkeerd als ${status}.`],
          [/^(.+) was updated by the user\.$/, (name) => `${name} is door de gebruiker bijgewerkt.`],
          [/^(.+) → (.+)$/, (from, to) => `${from} → ${to}`],
        ];

  for (const [pattern, formatter] of rules) {
    const match = text.match(pattern);
    if (match) return formatter(...match.slice(1));
  }
  return null;
}

export function translateText(text: string, language: Language) {
  if (language === "en" || !text.trim()) return text;
  const dictionary = dictionaries[language];
  const leading = text.match(/^\s*/)?.[0] ?? "";
  const trailing = text.match(/\s*$/)?.[0] ?? "";
  const end = trailing.length === 0 ? text.length : text.length - trailing.length;
  const core = text.slice(leading.length, end);

  const exact = dictionary[core];
  if (exact) return `${leading}${exact}${trailing}`;

  const dynamic = translateDynamic(core, language);
  if (dynamic) return `${leading}${dynamic}${trailing}`;

  let translated = core;
  const phrases = Object.entries(dictionary).sort(([a], [b]) => b.length - a.length);
  for (const [english, replacement] of phrases) {
    if (english.length < 4 || !translated.includes(english)) continue;
    translated = translated.split(english).join(replacement);
  }
  return `${leading}${translated}${trailing}`;
}

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const originalText = new WeakMap<Text, string>();
const appliedText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const appliedAttributes = new WeakMap<Element, Map<string, string>>();
const translatedAttributes = ["placeholder", "aria-label", "title", "alt"] as const;

function shouldSkip(element: Element | null) {
  return Boolean(
    element?.closest(
      "[data-no-translate], script, style, code, pre, textarea, [contenteditable='true']",
    ),
  );
}

function translateTextNode(node: Text, language: Language) {
  if (shouldSkip(node.parentElement)) return;
  const current = node.data;
  const previousApplied = appliedText.get(node);
  let original = originalText.get(node);

  if (original === undefined || (previousApplied !== undefined && current !== previousApplied && current !== original)) {
    original = current;
    originalText.set(node, original);
  }

  const next = translateText(original, language);
  if (current !== next) node.data = next;
  appliedText.set(node, next);
}

function translateElementAttributes(element: Element, language: Language) {
  if (shouldSkip(element)) return;
  let originals = originalAttributes.get(element);
  let applied = appliedAttributes.get(element);
  if (!originals) {
    originals = new Map();
    originalAttributes.set(element, originals);
  }
  if (!applied) {
    applied = new Map();
    appliedAttributes.set(element, applied);
  }

  for (const attribute of translatedAttributes) {
    const current = element.getAttribute(attribute);
    if (current === null) continue;
    const previousApplied = applied.get(attribute);
    let original = originals.get(attribute);
    if (original === undefined || (previousApplied !== undefined && current !== previousApplied && current !== original)) {
      original = current;
      originals.set(attribute, original);
    }
    const next = translateText(original, language);
    if (current !== next) element.setAttribute(attribute, next);
    applied.set(attribute, next);
  }
}

function translateSubtree(root: Node, language: Language) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text, language);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;

  if (root.nodeType === Node.ELEMENT_NODE) translateElementAttributes(root as Element, language);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) translateTextNode(node as Text, language);
    else translateElementAttributes(node as Element, language);
    node = walker.nextNode();
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Keep the server and first client render identical, then restore the saved
  // language after hydration. This avoids an SSR hydration mismatch.
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "vi" || saved === "nl" || saved === "en") setLanguageState(saved);
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback((text: string) => translateText(text, language), [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    translateSubtree(document.body, language);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") translateSubtree(mutation.target, language);
        if (mutation.type === "attributes") translateElementAttributes(mutation.target as Element, language);
        mutation.addedNodes.forEach((node) => translateSubtree(node, language));
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...translatedAttributes],
    });


    return () => observer.disconnect();
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}

export { languageLabels };

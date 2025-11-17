import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import fr from "@/locales/fr.json";
import pt from "@/locales/pt.json";
import zh from "@/locales/zh.json";
import ja from "@/locales/ja.json";
import ko from "@/locales/ko.json";
import id from "@/locales/id.json";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import "dayjs/locale/fr";
import "dayjs/locale/pt";
import "dayjs/locale/zh";
import "dayjs/locale/ja";
import "dayjs/locale/ko";
import "dayjs/locale/id";

// Extend dayjs with relativeTime plugin globally
dayjs.extend(relativeTime);

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
  id: {
    translation: id,
  },
  pt: {
    translation: pt,
  },
  zh: {
    translation: zh,
  },
  ja: {
    translation: ja,
  },
  ko: {
    translation: ko,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.getLocales()[0]?.languageCode || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// Set initial dayjs locale to match i18n
const initialLocale = i18n.language;
dayjs.locale(initialLocale);
console.log(
  "111111 dayjs initial locale set to:",
  initialLocale,
  "current:",
  dayjs.locale(),
);

// Listen for language changes and update dayjs locale
i18n.on("languageChanged", (lng) => {
  dayjs.locale(lng);
  console.log(
    "222222 dayjs locale changed to:",
    lng,
    "current:",
    dayjs.locale(),
  );
});

console.log("i18n initialized with language:", i18n.language);

export default i18n;
export { dayjs };

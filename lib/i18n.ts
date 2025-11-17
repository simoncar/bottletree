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

console.log("i18n initialized with language:", i18n.language);

export default i18n;

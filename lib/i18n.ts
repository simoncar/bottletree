import { I18n } from "i18n-js";

//NOTE: Sometimes the following is too large for batch, so do languages individually

//i18n-translate-json AIzaSyA-u3kUGycFCQQC5S3r2p2nQAGPRhKiMpE locales/ en zh,ja,fr,ko,es,id,pt

// https://github.com/meedan/i18n-translate-json

//I18n.fallbacks = true;

const i18n = new I18n({
  en: require("../locales/en.json"),
  zh: require("../locales/zh.json"),
  ja: require("../locales/ja.json"),
  fr: require("../locales/fr.json"),
  ko: require("../locales/ko.json"),
  es: require("../locales/es.json"),
  pt: require("../locales/pt.json"),
  id: require("../locales/id.json"),
});

export default i18n;

import "expo-router/entry";

import * as Sentry from "sentry-expo";
import * as Application from "expo-application";

Sentry.init({
  dsn: "https://4cc712a1ef2d35c86d74ca35e9aa8bed@o4505363191955456.ingest.sentry.io/4506092928827392",
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  release: "bottletree@1.0.58+60",
  environment: "production",
});

// Sentry.Native.captureMessage(
//   "Bottletree started : " +
//     Application.nativeApplicationVersion +
//     " --- " +
//     Application.nativeBuildVersion,
// );

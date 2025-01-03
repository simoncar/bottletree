import React, { useEffect } from "react";
import { Slot, useNavigationContainerRef } from "expo-router";
import { SessionProvider } from "@/lib/ctx";
import { RootSiblingParent } from "react-native-root-siblings";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

https: Sentry.init({
  dsn: "https://4cc712a1ef2d35c86d74ca35e9aa8bed@o4505363191955456.ingest.us.sentry.io/4506092928827392",
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  tracesSampleRate: 1.0, // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing. Adjusting this value in production.
  integrations: [
    // Pass integration
    navigationIntegration,
  ],
  enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
});

function RootLayout() {
  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <RootSiblingParent>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </RootSiblingParent>
  );
}

export default Sentry.wrap(RootLayout);

import React, { useEffect, useContext } from "react";
import { Slot, useNavigationContainerRef } from "expo-router";
import { SessionProvider } from "@/lib/ctx";
import { RootSiblingParent } from "react-native-root-siblings";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import { auth, db, firestore } from "@/lib/firebase";
import { useSession } from "@/lib/ctx";
import { UserProvider } from "@/lib/UserContext";
import { UserContext } from "@/lib/UserContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !__DEV__ && !isRunningInExpoGo(),
});

if (
  !__DEV__ &&
  !isRunningInExpoGo() &&
  !(typeof navigator !== "undefined" && navigator.userAgent.includes("Mozilla"))
) {
  Sentry.init({
    dsn: "https://4cc712a1ef2d35c86d74ca35e9aa8bed@o4505363191955456.ingest.us.sentry.io/4506092928827392",
    debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
    tracesSampleRate: 1.0, // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing. Adjusting this value in production.
    integrations: [
      // Pass integration
      navigationIntegration,
    ],
    enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
  });
}

console.log("/app/_layout.tsx , setup sentry and navigationIntegration");

function RootLayout() {
  const ref = useNavigationContainerRef();
  const { session, isAuthLoading } = useSession();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (ref?.current && !__DEV__) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <SessionProvider>
          <UserProvider>
            <Slot />
          </UserProvider>
        </SessionProvider>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(RootLayout);

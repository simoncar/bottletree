import { SessionProvider, useSession } from "@/lib/ctx";
import i18n from "@/lib/i18n";
import { UserContext, UserProvider } from "@/lib/UserContext";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import { Slot, useNavigationContainerRef } from "expo-router";
import React, { useContext, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-toast-message";


const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !__DEV__ && !isRunningInExpoGo(),
});

if (!__DEV__ && (Platform.OS === "android" || Platform.OS === "ios")) {
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
      <I18nextProvider i18n={i18n}>
        <SessionProvider>
          <UserProvider>
            <RootSiblingParent>
              <Slot />
              <Toast />
            </RootSiblingParent>
          </UserProvider>
        </SessionProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(RootLayout);

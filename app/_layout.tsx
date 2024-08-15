import React from "react";
import { Slot } from "expo-router";
import { SessionProvider } from "@/lib/ctx";
import { RootSiblingParent } from "react-native-root-siblings";

export default function Root() {
  return (
    <RootSiblingParent>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </RootSiblingParent>
  );
}

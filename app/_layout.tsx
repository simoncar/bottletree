import React from "react";
import { Slot } from "expo-router";
import { SessionProvider } from "@/lib/ctx";

export default function Root() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}

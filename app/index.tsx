import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { getUser } from "@/lib/APIuser";
import { useAuth } from "@/lib/authProvider";
import { auth, firestore } from "@/lib/firebase";

const Index = () => {
  return <Redirect href="/welcome" />;
};

export default Index;

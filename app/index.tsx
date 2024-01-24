import React from "react";
import { Redirect } from "expo-router";
import { getUser } from "@/lib/APIuser";
import { useAuth } from "@/lib/authProvider";

const Index = () => {
  const { sharedDataUser } = useAuth();
  let project = "welcome";

  console.log("IndexIndex - sharedDataUser:", sharedDataUser);

  if (sharedDataUser) {
    getUser(sharedDataUser.uid, (dbuser) => {
      if (dbuser) {
        if (dbuser.project) {
          project = dbuser.project;
          console.log("IndexAAAAAAA: ", project);
        }
      }
    });
  }

  return <Redirect href="/welcome" />;
};

export default Index;

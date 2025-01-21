import React, { useState, useContext } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Pressable,
  useColorScheme,
} from "react-native";
import { useSession } from "@/lib/ctx";
import { Stack, router } from "expo-router";
import { Text, View, TextInput } from "@/components/Themed";
import { updateAccountName, mergeUser } from "@/lib/APIuser";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "@/constants/Colors";
import { addLog } from "@/lib/APIlog";
import { About } from "@/lib/about";
import { auth } from "@/lib/firebase";
import { UserContext } from "@/lib/UserContext";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { signUp } = useSession();
  const { user, setUser } = useContext(UserContext);
  const colorScheme = useColorScheme();
  const oldUid = auth().currentUser?.uid;

  const signUpCallback = async (user, error) => {
    if (error == "SignUp Success") {
      console.log("signUpCallback Success:", user);

      updateAccountName(user.uid, user.displayName); //firebease auth update function

      mergeUser(oldUid, user);

      addLog({
        loglevel: "INFO",
        message: "Create Account Success",
        user: user.uid,
        email: user.email,
      });
      router.navigate("/");
    } else {
      //updateSharedDataUser(null);
      if (error && typeof error.message === "string") {
        setErrorMessage(strip(error.message));
      } else {
        setErrorMessage("Unknown Error");
      }
    }
  };

  const strip = (str: string) => {
    if (!str) return "";
    let returnMessage = "";
    try {
      returnMessage = str.substring(str.lastIndexOf("]") + 1).trim();
    } catch (error) {
      console.error("Error stripping string:", error);
      returnMessage = str;
    }

    return returnMessage;
  };

  const renderOldUser = () => {
    if (oldUid) {
      return (
        <View style={styles.notificationView}>
          <Text numberOfLines={3} style={styles.notificationUID}>
            {oldUid}
          </Text>
        </View>
      );
    }
  };

  const renderAction = (errorMessage: string) => {
    if (errorMessage == "SignUp Success") {
      return;
    } else {
      return (
        <TouchableOpacity
          onPress={async () => {
            signUp(name, email, password, signUpCallback);
          }}
          style={styles.button}>
          <Text style={styles.loginText}>Create Account</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Create Account" }} />

      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          inputMode="text"
          placeholder="Name"
          autoCorrect={false}
          autoFocus
          autoComplete="name"
          textContentType="name"
          onChangeText={(name) => setName(name)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          keyboardType="email-address"
          inputMode="email"
          autoCapitalize="none"
          placeholder="Email"
          autoComplete="email"
          spellCheck={false}
          textContentType="emailAddress"
          onChangeText={(email) => setEmail(email)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry={secureEntry}
          autoComplete="password"
          textContentType="password"
          onChangeText={(password) => {
            setPassword(password);
            setErrorMessage("");
          }}
        />
        <Pressable onPress={() => setSecureEntry(!secureEntry)}>
          <AntDesign
            name="eye"
            size={25}
            style={styles.eye}
            color={Colors[colorScheme ?? "light"].text}
          />
        </Pressable>
      </View>
      <View style={styles.notificationView}>
        <Text numberOfLines={3} style={styles.notificationText}>
          {errorMessage}
        </Text>
      </View>

      {renderAction(errorMessage)}
      {renderOldUser()}
      <View style={styles.aboutContainer}>
        <About />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  aboutContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
    paddingTop: 50,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#9D5BD0",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    marginBottom: 10,
    width: 300,
  },
  container: {
    alignItems: "center",
    flex: 1,
    paddingTop: 40,
  },
  eye: { color: "grey", paddingTop: 10 },
  inputView: {
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    flexDirection: "row",
    height: 45,
    marginBottom: 20,
    width: "80%",
  },

  loginText: {
    color: "white",
    fontSize: 18,
  },
  notificationText: {
    fontSize: 18,
  },
  notificationUID: {
    color: "grey",
    fontSize: 12,
    paddingTop: 30,
  },
  notificationView: {
    borderRadius: 5,
    marginBottom: 20,
    width: "80%",
  },
  textInput: {
    alignItems: "flex-start",
    flex: 1,
    fontSize: 18,
    height: 50,
    marginLeft: 10,
    padding: 10,
  },
});

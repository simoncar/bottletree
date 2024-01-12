import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Pressable,
  useColorScheme,
} from "react-native";
import { useAuth } from "@/lib/authProvider";
import { Stack, router } from "expo-router";
import { Text, View, TextInput } from "@/components/Themed";
import { updateAccountName } from "@/lib/APIuser";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "@/constants/Colors";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { updateSharedDataUser, createAccount, signIn } = useAuth();
  const colorScheme = useColorScheme();

  const createAccountCallback = (user, error) => {
    console.log("createAccountCallback:", error);
    if (error == "Success") {
      updateAccountName(name); //firebease auth update function
      updateSharedDataUser(user);
    } else {
      updateSharedDataUser(null);
    }
    setErrorMessage(strip(error));
  };

  const strip = (str: string) => {
    return str.substring(str.lastIndexOf("]") + 1).trim();
  };

  const renderAction = (errorMessage: string) => {
    if (errorMessage == "Success") {
      return (
        <TouchableOpacity
          onPress={async () => {
            router.replace({
              pathname: "/SignIn",
              params: {},
            });
          }}
          style={styles.loginBtn}>
          <Text style={styles.loginText}>SIGN In</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={async () => {
            console.log("touchable opacity signin");

            // signIn(email, password, loginError);

            createAccount(name, email, password, createAccountCallback);
          }}
          style={styles.loginBtn}>
          <Text style={styles.loginText}>CREATE ACCOUNT</Text>
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
          onChangeText={(email) => setEmail(email)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry={secureEntry}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    paddingTop: 100,
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
  loginBtn: {
    alignItems: "center",
    backgroundColor: "#9D5BD0",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    marginTop: 40,
    width: "80%",
  },
  loginText: {
    color: "white",
    fontSize: 18,
  },
  notificationText: {
    fontSize: 18,
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

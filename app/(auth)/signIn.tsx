import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../../lib/authProvider";
import { Image } from "expo-image";
import { Stack, router } from "expo-router";
import { Text, View, TextInput } from "../../components/Themed";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { signIn } = useAuth();

    const loginError = (error) => {
        console.log("SignIn Error:", error);
        setErrorMessage(error);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Sign In" }} />

            <Image
                style={styles.image}
                source={
                    "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Flogo%2FArm-Hammer-Logo.png?alt=media&token=cf1c4663-08f2-4bbf-bfc6-27fb3f4d098d"
                }
            />

            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    keyboardType="email-address"
                    inputMode="email"
                    placeholder="Email"
                    autoCapitalize="none"
                    autoFocus
                    autocomplete="email"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => {
                        setPassword(password);
                        setErrorMessage("");
                    }}
                />
            </View>
            <View>
                <Text>{errorMessage}</Text>
            </View>

            <TouchableOpacity
                onPress={async () => {
                    console.log("touchable opacity signin");

                    signIn(email, password, loginError);
                    //const resp = await appSignIn("simoncar@gmail.com", "password");
                    //console.log("resp: ", resp);
                    // if (resp?.user) {
                    // 	router.replace("/(tabs)/home");
                    // } else {
                    // 	console.log(resp.error);
                    // 	Alert.alert("Login Error", resp.error?.message);
                    // }
                }}
                style={styles.loginBtn}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
                key={"forgotPassword"}
                onPress={() => {
                    router.push({
                        pathname: "/forgotPassword",
                        params: {
                            email: email,
                        },
                    });
                }}>
                <Text style={styles.forgot_button}>Can't log in?</Text>
            </TouchableOpacity>
            <TouchableOpacity
                key={"createAccount"}
                onPress={() => {
                    router.push({
                        pathname: "/createAccount",
                        params: {
                            email: email,
                        },
                    });
                }}>
                <Text style={styles.forgot_button}>Create an account</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    TextInput: {
        alignItems: "flex-start",
        borderBottomColor: "#CED0CE",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flex: 1,
        height: 50,
        marginLeft: 20,
        padding: 10,
    },
    container: {
        alignItems: "center",
        flex: 1,
    },
    forgot_button: {
        height: 30,
        marginTop: 30,
    },
    image: {
        height: 200,
        marginBottom: 50,
        marginTop: 50,
        width: 200,
    },
    inputView: {
        borderRadius: 5,
        height: 45,
        marginBottom: 20,
        width: "70%",
    },
    loginBtn: {
        alignItems: "center",
        backgroundColor: "#E4E6C3",
        borderRadius: 25,
        height: 50,
        justifyContent: "center",
        marginTop: 40,
        width: "80%",
    },
    loginText: {
        color: "#000",
    },
});

import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../../lib/authProvider";
import { Stack, useRouter } from "expo-router";
import { Text, View, TextInput } from "../../components/Themed";
import { updateAccount } from "../../lib/APIuser";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { updateSharedDataUser, createAccount, signIn } = useAuth();
    const router = useRouter();

    const createAccountCallback = (user, error) => {
        console.log("createAccountCallback:", error);
        if (error == "Success") {
            updateAccount(name); //firebease auth update function
            updateSharedDataUser(user);
        } else {
            updateSharedDataUser(null);
        }
        setErrorMessage(error);
    };

    const renderAction = (errorMessage) => {
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

                        createAccount(
                            name,
                            email,
                            password,
                            createAccountCallback,
                        );
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
                    style={styles.TextInput}
                    inputMode="text"
                    placeholder="Name"
                    autoCorrect={false}
                    autoFocus
                    autocomplete="name"
                    onChangeText={(name) => setName(name)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    keyboardType="email-address"
                    inputMode="email"
                    autoCapitalize="none"
                    placeholder="Email"
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

            {renderAction(errorMessage)}
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
        paddingTop: 100,
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

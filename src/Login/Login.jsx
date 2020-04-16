import React, { useState, useEffect } from "react";
import { Text, StyleSheet, ImageBackground, View } from "react-native";
import LandingPhoto from "../../assets/Talkify-HomeScreen-V1.png";
import { Input, Button } from "react-native-elements";
import firebase from "../../firebase";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoginError, setIsLoginError] = useState(false);

  useEffect(() => {
    try {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          navigation.navigate("Home");
        } else {
          return;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const login = async () => {
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(email.toLocaleLowerCase(), password);
    } catch (error) {
      console.log(error);
      setIsLoginError(true);
      setTimeout(() => {
        setIsLoginError(false);
      }, 3000);
    }
  };

  return (
    <ImageBackground source={LandingPhoto} style={styles.wrapper}>
      <View style={styles.viewWrapper}>
        <View style={styles.buttonWrapper}>
          {isLoginError ? (
            <View style={styles.errorWrapper}>
              <Text style={styles.errorMsg}>Invalid email or password</Text>
            </View>
          ) : null}

          <Input
            inputContainerStyle={styles.input}
            onChangeText={(text) => setEmail(text)}
            value={email}
            keyboardType="email-address"
            placeholder="E-mail"
            leftIconContainerStyle={styles.icon}
            leftIcon={{
              type: "font-awesome",
              name: "at",
              color: "#808080",
            }}
          />
          <Input
            onChangeText={(text) => setPassword(text)}
            inputContainerStyle={styles.input}
            value={password}
            placeholder="Password"
            leftIconContainerStyle={styles.icon}
            secureTextEntry={true}
            leftIcon={{
              type: "font-awesome",
              name: "lock",
              color: "#808080",
            }}
          />
          <Button
            title="Login"
            type="outline"
            buttonStyle={styles.button}
            titleStyle={{ color: "white", fontSize: 20 }}
            onPress={login}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewWrapper: {
    flex: 1,
    flexDirection: "column",
    top: 30,
  },
  button: {
    top: 70,
    width: 150,
    borderRadius: 80,
    borderColor: "white",
    borderWidth: 2,
  },
  input: {
    width: 240,
    height: 40,
    backgroundColor: "white",
    borderRadius: 30,
    margin: 10,
    top: 40,
    borderBottomColor: "rgba(0,0,0,0)",
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorWrapper: {
    backgroundColor: "#ff443b",
    borderRadius: 5,
    top: 30,
  },
  errorMsg: {
    color: "#fff",
    fontSize: 15,
    padding: 8,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },
});

export default Login;

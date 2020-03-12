import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  ImageBackground,
  View,
  Dimensions
} from "react-native";
import LandingPhoto from "../../assets/Talkify-HomeScreen-V1.png";
import { Input, Button } from "react-native-elements";
import isEmail from "validator/lib/isEmail";
import isEmpty from "validator/lib/isEmpty";
import firebase from "../../firebase";

const Landing = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUsername] = useState("");
  const [isUserNameError, setIsUserNameSerror] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);

  useEffect(() => {
    console.log(Dimensions.get("window").height);
    try {
      firebase.auth().onAuthStateChanged(function(user) {
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

  const handleErrors = () => {
    if (isEmpty(userName)) {
      setIsUserNameSerror(true);
      const time1 = setTimeout(() => {
        setIsUserNameSerror(false);
      }, 3000);
      return;
    }
    if (!isEmail(email) || isEmpty(email)) {
      setIsEmailError(true);
      const time2 = setTimeout(() => {
        setIsEmailError(false);
      }, 3000);
      return;
    }

    if (
      isEmpty(password) ||
      password !== confirmPassword ||
      password.length < 6
    ) {
      setIsPasswordError(true);
      const time3 = setTimeout(() => {
        setIsPasswordError(false);
      }, 3000);
      return;
    }
  };

  const register = async () => {
    handleErrors();
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(email.toLowerCase(), password)
        .then(function(result) {
          return result.user.updateProfile({
            displayName: userName.toLowerCase(),
            photoURL:
              "https://pngimage.net/wp-content/uploads/2018/06/no-avatar-png-8.png"
          });
        });
      await firebase
        .firestore()
        .collection("users")
        .doc(userName.toLowerCase())
        .set({
          username: userName.toLowerCase(),
          email: email,
          photoURL:
            "https://pngimage.net/wp-content/uploads/2018/06/no-avatar-png-8.png"
        })
        .then(
          firebase
            .auth()
            .signInWithEmailAndPassword(email.toLocaleLowerCase(), password)
        );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ImageBackground source={LandingPhoto} style={styles.wrapper}>
      <View style={styles.buttonWrapper}>
        {isUserNameError ? (
          <View style={styles.errorWrapper}>
            <Text style={styles.errorMsg}>Please enter valid username!</Text>
          </View>
        ) : null}
        {isEmailError ? (
          <View style={styles.errorWrapper}>
            <Text style={styles.errorMsg}>Please enter valid email!</Text>
          </View>
        ) : null}
        {isPasswordError ? (
          <View style={styles.errorWrapper}>
            <Text style={styles.errorMsg}>Please enter valid password!</Text>
          </View>
        ) : null}

        <Input
          inputContainerStyle={styles.input}
          onChangeText={text => setUsername(text)}
          value={userName}
          placeholder="Username"
          leftIconContainerStyle={styles.icon}
          leftIcon={{
            type: "font-awesome",
            name: "user",
            color: "#808080"
          }}
        />
        <Input
          inputContainerStyle={styles.input}
          onChangeText={text => setEmail(text)}
          value={email}
          keyboardType="email-address"
          placeholder="E-mail"
          leftIconContainerStyle={styles.icon}
          leftIcon={{
            type: "font-awesome",
            name: "at",
            color: "#808080"
          }}
        />
        <Input
          onChangeText={text => setPassword(text)}
          inputContainerStyle={styles.input}
          value={password}
          placeholder="Password"
          leftIconContainerStyle={styles.icon}
          secureTextEntry={true}
          leftIcon={{
            type: "font-awesome",
            name: "lock",
            color: "#808080"
          }}
        />
        <Input
          onChangeText={text => setConfirmPassword(text)}
          inputContainerStyle={styles.input}
          value={confirmPassword}
          placeholder="Confirm Password"
          leftIconContainerStyle={styles.icon}
          secureTextEntry={true}
          leftIcon={{
            type: "font-awesome",
            name: "lock",
            color: "#808080"
          }}
        />
        <Button
          title="Register"
          type="outline"
          buttonStyle={styles.button}
          titleStyle={{ color: "white", fontSize: 20 }}
          onPress={register}
        />
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
    alignItems: "center"
  },
  button: {
    width: 150,
    borderRadius: 80,
    borderColor: "white",
    borderWidth: 2,
    top: 30
  },
  input: {
    width: 240,
    height: 40,
    backgroundColor: "white",
    borderRadius: 30,
    marginTop: Dimensions.get("window").height < 700 ? 15 : 30,
    borderBottomColor: "rgba(0,0,0,0)",
    elevation: 5
  },
  icon: {
    marginRight: 10
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    top: Dimensions.get("window").height > 1000 ? 140 : 100
  },
  errorWrapper: {
    backgroundColor: "#ff443b",
    borderRadius: 5,
    margin: 5
  },
  errorMsg: {
    color: "#fff",
    fontSize: 15,
    padding: 8,
    fontWeight: "bold",
    paddingHorizontal: 20
  }
});

export default Landing;

import React, { useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground
} from "react-native";
import LandingPhoto from "../../assets/Talkify-HomeScreen-V1.png";
import firebase from "../../firebase";

const Landing = ({ navigation }) => {
  useEffect(() => {
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

  return (
    <ImageBackground source={LandingPhoto} style={styles.wrapper}>
      <TouchableOpacity
        style={styles.buttonLog}
        underlayColor="#fff"
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonTextLog}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonReg}
        underlayColor="#fff"
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonTextReg}>Register</Text>
      </TouchableOpacity>
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
  buttonLog: {
    padding: 15,
    backgroundColor: "rgba(0,0,0,0)",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#fff",
    marginTop: 40,
    width: 240,
    position: "relative",
    top: 50
  },
  buttonReg: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#fff",
    marginTop: 40,
    width: 240,
    position: "relative",
    top: 70,
    elevation: 5
  },
  buttonTextReg: {
    color: "#00d1b2",
    textAlign: "center",
    paddingHorizontal: 40,
    fontSize: 20,
    fontWeight: "bold"
  },
  buttonTextLog: {
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 40,
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default Landing;

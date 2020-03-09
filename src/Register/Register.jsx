import React from "react";
import {
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  ImageBackground
} from "react-native";
import LandingPhoto from "../../assets/Talkify-HomeScreen-V1.png";

const Landing = () => {
  return (
    <ImageBackground source={LandingPhoto} style={styles.wrapper}>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => props.navigation.navigate("HomeScreen")}
        underlayColor="#fff"
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => props.navigation.navigate("HomeScreen")}
        underlayColor="#fff"
      >
        <Text style={styles.buttonText}>Register</Text>
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
  loginButton: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    marginTop: 40,
    width: 200,
    position: "relative",
    top: 40
  },
  registerButton: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    marginTop: 40,
    width: 200,
    position: "relative",
    top: 40
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 40,
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default Landing;

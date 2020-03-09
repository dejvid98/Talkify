import * as React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground
} from "react-native";
import LandingPhoto from "../../assets/Talkify-HomeScreen-V1.png";

const Landing = ({ navigation }) => {
  return (
    <ImageBackground source={LandingPhoto} style={styles.wrapper}>
      <TouchableOpacity
        style={styles.button}
        underlayColor="#fff"
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigate("HomeScreen")}
        underlayColor="#fff"
        onPress={() => navigation.navigate("Register")}
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
  button: {
    padding: 15,
    backgroundColor: "rgba(0,0,0,0)",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#fff",
    marginTop: 40,
    width: 200,
    position: "relative",
    top: 50
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

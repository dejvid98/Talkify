import React, { useState } from "react";
import { StyleSheet, ImageBackground, View } from "react-native";
import LandingPhoto from "../../assets/Talkify-HomeScreen-V1.png";
import { Input, Button } from "react-native-elements";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ImageBackground source={LandingPhoto} style={styles.wrapper}>
      <View style={styles.buttonWrapper}>
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
        <Button
          title="Login"
          type="outline"
          buttonStyle={styles.button}
          titleStyle={{ color: "white", fontSize: 20 }}
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
    top: 70,
    width: 150,
    borderRadius: 80,
    borderColor: "white",
    borderWidth: 2
  },
  input: {
    width: 240,
    height: 40,
    backgroundColor: "white",
    borderRadius: 30,
    marginTop: 30,
    top: 40,
    borderBottomColor: "rgba(0,0,0,0)"
  },
  icon: {
    marginRight: 10
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Landing;

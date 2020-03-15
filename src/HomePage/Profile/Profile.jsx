import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import firebase from "../../../firebase";
import { TouchableOpacity } from "react-native-gesture-handler";

const Profile = ({ navigation }) => {
  const currentUser = firebase.auth().currentUser;
  const [photoState, setPhotoState] = useState(currentUser.photoURL);
  const storage = firebase.storage();
  const storageRef = storage.ref();
  const defaultPhoto =
    "https://pngimage.net/wp-content/uploads/2018/06/no-avatar-png-8.png";

  const userCapitalized =
    currentUser.displayName.charAt(0).toUpperCase() +
    currentUser.displayName.substring(1);

  const uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };

      xhr.onerror = function() {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);

      xhr.send(null);
    });
  };

  const uploadPhoto = async photo => {
    try {
      const storageRef = await firebase
        .storage()
        .ref("avatars/" + currentUser.displayName.toLowerCase());
      const imageBlob = await uriToBlob(photo);
      await storageRef.put(imageBlob);
      await getPhotoURL();
    } catch (error) {
      console.log(error);
    }
  };

  const getPhotoURL = async () => {
    try {
      await storageRef
        .child("avatars/" + currentUser.displayName.toLowerCase())
        .getDownloadURL()
        .then(function(url) {
          setPhotoState(url);
          currentUser.updateProfile({ photoURL: url });
        });
    } catch (error) {
      setPhotoState(defaultPhoto);
    }
  };

  const openGallery = async () => {
    try {
      const pic = await ImagePicker.launchImageLibraryAsync();
      if (pic.uri) {
        setPhotoState(pic.uri);
        uploadPhoto(pic.uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    firebase.auth().signOut();
    navigation.navigate("LandingLogout");
  };

  useEffect(() => {
    getPhotoURL();
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Profile</Text>
      </View>
      <View style={styles.mainWindow}>
        <View style={styles.imageWrapper}>
          <Image style={styles.image} source={{ uri: photoState }} />
          <Text style={styles.username}>{userCapitalized}</Text>
          <Button
            title="Upload image"
            buttonStyle={styles.button}
            titleStyle={{
              fontSize: 20,
              color: "#0873ff"
            }}
            onPress={openGallery}
          />
          <TouchableOpacity style={styles.logOutWrapper} onPress={handleLogout}>
            <Text
              style={{
                fontSize: 20,
                color: "#ff5252"
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "flex-start"
  },
  title: {
    flex: 1,
    maxHeight: 120,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#05AC72"
  },
  titleText: {
    position: "relative",
    marginTop: 70,
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold"
  },
  mainWindow: {
    backgroundColor: "#fff",
    flex: 1,
    position: "absolute",
    alignItems: "center",
    top: 120,
    bottom: 0,
    left: 0,
    right: 0
  },
  imageWrapper: {
    flex: 1,
    alignItems: "center",
    marginTop: 30
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 250
  },
  username: {
    fontSize: 30,
    marginTop: 30
  },
  button: {
    borderRadius: 40,
    backgroundColor: "white",
    paddingHorizontal: 30,
    marginTop: 40,
    elevation: 5
  },
  lottie: {
    width: 100,
    height: 100
  },
  logOutWrapper: {
    borderRadius: 50,
    padding: 10,
    width: 185,
    marginTop: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    backgroundColor: "white",
    borderColor: "#ff5252",
    borderWidth: 1
  }
});

export default Profile;

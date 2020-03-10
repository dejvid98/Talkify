import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import firebase from "../../firebase";

const Home = () => {
  const currentUser = firebase.auth().currentUser;
  const [photoState, setPhotoState] = useState(currentUser.photoURL);
  const storage = firebase.storage();
  const storageRef = storage.ref();
  const defaultPhoto =
    "https://pngimage.net/wp-content/uploads/2018/06/no-avatar-png-8.png";

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
        .ref("avatars/" + currentUser.displayName);
      const imageBlob = await uriToBlob(photo);
      await storageRef.put(imageBlob);
    } catch (error) {
      console.log(error);
    }
  };

  const getPhotoURL = async () => {
    try {
      await storageRef
        .child("avatars/" + currentUser.displayName)
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
    const pic = await ImagePicker.launchImageLibraryAsync();
    setPhotoState(pic.uri);
    uploadPhoto(pic.uri);
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
          <Text style={styles.username}>{currentUser.displayName}</Text>
          <Button
            title="Change avatar"
            buttonStyle={styles.button}
            titleStyle={{ fontSize: 20 }}
            icon={
              <Icon
                name="image"
                size={25}
                color="white"
                style={{ paddingHorizontal: 10, paddingVertical: 4 }}
              />
            }
            onPress={openGallery}
          />
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
    backgroundColor: "#30e3ca"
  },
  titleText: {
    position: "relative",
    marginTop: 65,
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold"
  },
  mainWindow: {
    backgroundColor: "#e4f9f5",
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
    marginTop: 30,
    width: 300,
    height: 300
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 250
  },
  username: {
    fontSize: 30,
    marginTop: 30
  },
  button: {
    borderRadius: 40,
    backgroundColor: "#54b0ff",
    paddingHorizontal: 30,
    marginTop: 40,
    elevation: 5
  },
  lottie: {
    width: 100,
    height: 100
  }
});

export default Home;

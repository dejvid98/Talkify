import React, { useState } from "react";
import firebase from "../../firebase";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Icon } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";

const AddFriend = props => {
  const [username, setUsername] = useState("");
  const [isError, setIsError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = firebase.auth().currentUser;

  const handleError = () => {
    setIsError(true);

    setTimeout(() => {
      setIsError(false);
    }, 3000);
  };

  const handleAdd = async () => {
    const db = firebase.firestore();
    const storage = firebase.storage();
    const storageRef = storage.ref();
    let receiverPhoto = "";
    if (username.length < 1) {
      return;
    }

    const recRef = db.collection("users").doc(username.toLowerCase());
    setIsLoading(true);

    await recRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          handleError();
          setIsLoading(false);
          return;
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
        setIsLoading(false);
        return;
      });

    try {
      await storageRef
        .child("avatars/" + username.toLowerCase().trim())
        .getDownloadURL()
        .then(function(url) {
          receiverPhoto = url;
        });
    } catch (error) {
      try {
        await db
          .collection("users")
          .doc(username.toLowerCase().trim())
          .get()
          .then(doc => {
            receiverPhoto = doc.data().photoURL;
          });
      } catch (error) {
        handleError();
        setIsLoading(false);
        return;
      }
    }

    await db
      .collection("friends")
      .doc(username.toLowerCase().trim())
      .collection("friendList")
      .doc(currentUser.displayName)
      .set({
        friendName: currentUser.displayName,
        friendPhoto: currentUser.photoURL
      });

    await db
      .collection("friends")
      .doc(currentUser.displayName.toLowerCase())
      .collection("friendList")
      .doc(username.toLowerCase().trim())
      .set({
        friendName: username.toLowerCase().trim(),
        friendPhoto: receiverPhoto
      });
    setIsLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setUsername("");
    }, 3000);
  };

  return (
    <View style={styles.wrapper}>
      {isError ? (
        <View style={styles.errorWrapper}>
          <Text style={styles.errorMsg}>User doesn't exist!</Text>
        </View>
      ) : null}
      {success ? (
        <View style={styles.successWrapper}>
          <Text style={styles.success}>
            {username.charAt(0).toUpperCase() + username.substring(1) + " "}
            successfully added!
          </Text>
        </View>
      ) : null}
      {isLoading ? (
        <Spinner
          visible={isLoading}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />
      ) : null}
      <Text style={styles.titleText}>Add a new friend</Text>
      <View style={styles.inputWrapper}>
        <View style={{ width: 220 }}>
          <TextInput
            multiline={true}
            style={styles.inputTo}
            placeholder="Username"
            value={username}
            onChangeText={text => setUsername(text)}
          />
          <View style={styles.chatIcon}>
            <TouchableOpacity style={styles.iconWrapper} onPress={handleAdd}>
              <Icon
                name="add"
                type="material"
                iconStyle={{ fontSize: 30, color: "white", padding: 2 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    flex: 1,
    maxHeight: 120,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#4ede9a"
  },
  titleText: {
    position: "relative",
    marginTop: 65,
    fontSize: 30,
    color: "rgba(0,0,0,0.5)",
    fontWeight: "bold",
    marginBottom: 30
  },
  inputWrapper: {
    width: 300,
    height: 300,
    alignItems: "center"
  },
  inputTo: {
    borderColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    margin: 5
  },
  inputText: {
    borderColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    margin: 5,
    width: 300
  },
  buttonWrapper: {
    flex: 1,
    width: 320,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonReg: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#fff",
    width: 200,
    position: "relative",
    top: 0,
    elevation: 5
  },
  buttonTextReg: {
    color: "#00d1b2",
    textAlign: "center",
    paddingHorizontal: 40,
    fontSize: 20,
    fontWeight: "bold"
  },
  successWrapper: {
    backgroundColor: "#21db73",
    borderRadius: 5,
    top: 30
  },
  success: {
    color: "#fff",
    fontSize: 20,
    padding: 8,
    fontWeight: "bold",
    paddingHorizontal: 20
  },
  errorWrapper: {
    backgroundColor: "#ff443b",
    borderRadius: 5,
    top: 30
  },
  errorMsg: {
    color: "#fff",
    fontSize: 20,
    padding: 8,
    fontWeight: "bold",
    paddingHorizontal: 20
  },
  chatIcon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  iconWrapper: {
    backgroundColor: "#25d366",
    borderRadius: 60,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 150
  },
  spinnerTextStyle: {
    color: "white",
    fontSize: 30
  }
});

export default AddFriend;

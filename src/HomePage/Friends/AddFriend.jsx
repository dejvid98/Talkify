import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Icon } from "react-native-elements";
import firebase from "../../../firebase";
import { AppContext } from "../../../Context";

const Friends = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [isError, setIsError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { targetContext, isChattingContext } = useContext(AppContext);
  const [target, setTarget] = targetContext;
  const [isChatting, setIsChatting] = isChattingContext;
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
    setIsLoading(true);

    await db
      .collection("users")
      .doc(username.toLowerCase())
      .get()
      .then(function (doc) {
        if (!doc.exists) {
          handleError();
          setIsLoading(false);
          return;
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
        setIsLoading(false);
        return;
      });

    try {
      await storageRef
        .child("avatars/" + username.toLowerCase().trim())
        .getDownloadURL()
        .then(function (url) {
          receiverPhoto = url;
        });
    } catch (error) {
      try {
        await db
          .collection("users")
          .doc(username.toLowerCase().trim())
          .get()
          .then((doc) => {
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
        friendPhoto: currentUser.photoURL,
      });

    await db
      .collection("friends")
      .doc(currentUser.displayName.toLowerCase())
      .collection("friendList")
      .doc(username.toLowerCase().trim())
      .set({
        friendName: username.toLowerCase().trim(),
        friendPhoto: receiverPhoto,
      });

    setIsLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setUsername("");
    }, 3000);
  };

  useEffect(
    () => {
      setTarget("");
      setIsChatting(false);
    },
    //eslint-disable-next-line
    []
  );
  return (
    <View style={styles.wrapper}>
      <View style={styles.title}>
        <View style={{ flex: 3 }}>
          <Icon
            name="arrow-left"
            type="font-awesome"
            containerStyle={styles.icon}
            iconStyle={{ fontSize: 35, color: "white" }}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View
          style={{ flex: 20, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.titleText}>Add friend</Text>
        </View>
      </View>
      <View style={styles.contentWrapper}>
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
        <Text style={styles.addNewFriend}>Add a new friend</Text>

        <View>
          <View style={styles.addWrapper}>
            <TextInput
              multiline={true}
              style={styles.inputTo}
              placeholder="Username"
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
            <View style={styles.chatIcon}>
              <TouchableOpacity onPress={handleAdd}>
                <Icon
                  name="add"
                  type="material"
                  iconStyle={{ fontSize: 40, color: "white" }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    bottom: 70,
  },

  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  addWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    left: 30,
  },
  addNewFriend: {
    position: "relative",
    fontSize: 20,
    color: "rgba(0,0,0,0.5)",
    fontWeight: "bold",
    marginBottom: 30,
  },
  inputWrapper: {
    height: 300,
  },
  inputTo: {
    borderColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    width: 200,
  },
  inputText: {
    borderColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
  },

  successWrapper: {
    backgroundColor: "#21db73",
    borderRadius: 5,
    marginBottom: 20,
  },
  success: {
    color: "#fff",
    fontSize: 20,
    padding: 8,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },
  errorWrapper: {
    backgroundColor: "#ff443b",
    borderRadius: 5,
    marginBottom: 25,
  },
  errorMsg: {
    color: "#fff",
    fontSize: 20,
    padding: 8,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },
  chatIcon: {
    backgroundColor: "#4ecca3",
    borderRadius: 60,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    right: 30,
  },

  spinnerTextStyle: {
    color: "white",
    fontSize: 30,
  },

  title: {
    flex: 1,
    maxHeight: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4ecca3",
    flexDirection: "row",
  },

  titleText: {
    position: "relative",
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    top: 15,
    right: 25,
  },

  icon: {
    backgroundColor: "rgba(0,0,0,0)",
    top: 15,
    left: 15,
  },

  iconWrapper: {
    backgroundColor: "#25d366",
    borderRadius: 60,
  },
});

export default Friends;

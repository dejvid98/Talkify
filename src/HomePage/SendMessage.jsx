import React, { useState, useContext } from "react";
import firebase from "../../firebase";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";
import { AppContext } from "../../Context";

const Home = () => {
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState("");
  const { newMessageContext } = useContext(AppContext);
  //eslint-disable-next-line
  const [newMessage, setNewMessage] = newMessageContext;

  const sendMessage = async () => {
    const time = new Date().toLocaleString();
    const currentUser = firebase.auth().currentUser;
    const storage = firebase.storage();
    const storageRef = storage.ref();
    let receiverPhoto = "";

    // Looks for a photo in DB, if not found, sets a default one
    try {
      await storageRef
        .child("avatars/" + receiver)
        .getDownloadURL()
        .then(function(url) {
          receiverPhoto = url;
        });
    } catch (error) {
      await firebase
        .firestore()
        .collection("users")
        .doc(receiver)
        .get()
        .then(doc => {
          receiverPhoto = doc.data().photoURL;
        });
    }

    // Looks for a user in DB, reterives his info and sets it as metadata in message

    try {
      await firebase
        .firestore()
        .collection("messages")
        .doc(receiver)
        .collection("senders")
        .doc(currentUser.displayName)
        .set({
          senderName: currentUser.displayName,
          senderPhoto: currentUser.photoURL,
          receiver: receiver,
          receiverPhoto
        });

      await firebase
        .firestore()
        .collection("messages")
        .doc(currentUser.displayName)
        .collection("senders")
        .doc(receiver)
        .set({
          senderName: currentUser.displayName,
          senderPhoto: currentUser.photoURL,
          receiver: receiver,
          receiverPhoto
        });

      await firebase
        .firestore()
        .collection("messages")
        .doc(receiver)
        .collection("senders")
        .doc(currentUser.displayName)
        .collection("messages")
        .add({
          senderName: currentUser.displayName,
          senderPhoto: currentUser.photoURL,
          receiver: receiver,
          text: message,
          timestamp: time,
          receiverPhoto
        });

      await firebase
        .firestore()
        .collection("messages")
        .doc(currentUser.displayName)
        .collection("senders")
        .doc(receiver)
        .collection("messages")
        .add({
          senderName: currentUser.displayName,
          senderPhoto: currentUser.photoURL,
          receiver: receiver,
          text: message,
          timestamp: time,
          receiverPhoto
        });
      setNewMessage(message => message + 1);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.titleText}>Send a message</Text>
      <View style={styles.inputWrapper}>
        <View style={{ width: 150 }}>
          <TextInput
            multiline={true}
            style={styles.inputTo}
            placeholder="To"
            value={receiver}
            onChangeText={text => setReceiver(text)}
          />
        </View>
        <TextInput
          multiline={true}
          style={styles.inputText}
          placeholder="Message"
          numberOfLines={4}
          value={message}
          onChangeText={text => setMessage(text)}
        />
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.buttonReg}
            underlayColor="#fff"
            onPress={sendMessage}
          >
            <Text style={styles.buttonTextReg}>Send</Text>
          </TouchableOpacity>
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
    alignItems: "flex-start"
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
  }
});

export default Home;

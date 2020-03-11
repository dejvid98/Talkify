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
import Spinner from "react-native-loading-spinner-overlay";

const SendMessage = props => {
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState("");
  const { newMessageContext } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  //eslint-disable-next-line
  const [newMessage, setNewMessage] = newMessageContext;

  const handleError = () => {
    setIsError(true);

    setTimeout(() => {
      setIsError(false);
    }, 3000);
  };

  const sendMessage = async () => {
    const time = new Date().toLocaleString();
    const currentUser = firebase.auth().currentUser;
    const storage = firebase.storage();
    const storageRef = storage.ref();
    let receiverPhoto = "";
    if (message.length < 1 || receiver.length < 1) {
      return;
    }
    setIsLoading(true);
    const recRef = firebase
      .firestore()
      .collection("users")
      .doc(receiver);

    recRef
      .get()
      .then(function(doc) {
        if (!doc.exists) {
          handleError();
          return;
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });

    // Looks for a photo in DB, if not found, sets a default one
    try {
      await storageRef
        .child("avatars/" + receiver.toLowerCase().trim())
        .getDownloadURL()
        .then(function(url) {
          receiverPhoto = url;
        });
    } catch (error) {
      try {
        await firebase
          .firestore()
          .collection("users")
          .doc(receiver.toLowerCase().trim())
          .get()
          .then(doc => {
            receiverPhoto = doc.data().photoURL;
          });
      } catch (err) {
        return;
      }
    }

    // Looks for a user in DB, reterives his info and sets it as metadata in message

    try {
      await firebase
        .firestore()
        .collection("messages")
        .doc(receiver.toLowerCase().trim())
        .collection("senders")
        .doc(currentUser.displayName)
        .set({
          senderName: currentUser.displayName,
          senderPhoto: currentUser.photoURL,
          receiver: receiver.toLowerCase().trim(),
          receiverPhoto,
          message: message,
          timestamp: time
        });

      await firebase
        .firestore()
        .collection("messages")
        .doc(currentUser.displayName)
        .collection("senders")
        .doc(receiver.toLowerCase().trim())
        .set({
          senderName: currentUser.displayName,
          senderPhoto: currentUser.photoURL,
          receiver: receiver.toLowerCase().trim(),
          receiverPhoto,
          message: message,
          timestamp: time
        });

      await firebase
        .firestore()
        .collection("messages")
        .doc(receiver.toLowerCase().trim())
        .collection("senders")
        .doc(currentUser.displayName)
        .collection("messages")
        .add({
          senderName: currentUser.displayName,
          senderPhoto: currentUser.photoURL,
          receiver: receiver.toLowerCase().trim(),
          text: message,
          timestamp: time,
          receiverPhoto
        });

      await firebase
        .firestore()
        .collection("messages")
        .doc(currentUser.displayName)
        .collection("senders")
        .doc(receiver.toLowerCase().trim())
        .collection("messages")
        .add({
          senderName: currentUser.displayName,
          senderPhoto: currentUser.photoURL,
          receiver: receiver.toLowerCase().trim(),
          text: message,
          timestamp: time,
          receiverPhoto
        })
        .then(setIsLoading(false));

      setNewMessage(message => message + 1);
      props.handleSend();
      
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      return;
    }
  };

  return (
    <View style={styles.wrapper}>
      {isError ? (
        <View style={styles.errorWrapper}>
          <Text style={styles.errorMsg}>User doesn't exist!</Text>
        </View>
      ) : null}

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
  }
});

export default SendMessage;

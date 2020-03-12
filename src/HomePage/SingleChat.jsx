import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  FlatList
} from "react-native";
import firebase from "../../firebase";
import { Icon } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
import { AppContext } from "../../Context";

const SingleChat = props => {
  const { newMessageContext, targetContext } = useContext(AppContext);
  const [newMessage, setNewMessage] = newMessageContext;
  const [target, setTarget] = targetContext;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receiverPhoto, setReceiverPhoto] = useState("");
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = firebase.auth().currentUser;
  const inputEl = useRef(null);

  const updateLastMessage = async () => {
    const time = new Date();
    let receiverPhoto = "";

    const storage = firebase.storage();
    const storageRef = storage.ref();

    try {
      await storageRef
        .child("avatars/" + props.target.toLowerCase().trim())
        .getDownloadURL()
        .then(function(url) {
          receiverPhoto = url;
        });
    } catch (error) {
      await firebase
        .firestore()
        .collection("users")
        .doc(props.target.toLowerCase().trim())
        .get()
        .then(doc => {
          receiverPhoto = doc.data().photoURL;
        });
    }

    await firebase
      .firestore()
      .collection("messages")
      .doc(props.target)
      .collection("senders")
      .doc(currentUser.displayName)
      .set({
        message: message.trim(),
        timestamp: firebase.firestore.Timestamp.fromDate(time),
        senderPhoto: currentUser.photoURL,
        receiver: props.target,
        senderName: currentUser.displayName,
        receiverPhoto
      });
    await firebase
      .firestore()
      .collection("messages")
      .doc(currentUser.displayName)
      .collection("senders")
      .doc(props.target)
      .set({
        message: message.trim(),
        timestamp: firebase.firestore.Timestamp.fromDate(time),
        senderPhoto: currentUser.photoURL,
        receiver: currentUser.displayName,
        senderName: props.target,
        receiverPhoto
      });
  };

  const sendMessage = async e => {
    const id = Math.random() * 500;
    const time = new Date();
    if (message.trim().length > 0) {
      try {
        await firebase
          .firestore()
          .collection("messages")
          .doc(props.target)
          .collection("senders")
          .doc(currentUser.displayName)
          .collection("messages")
          .add({
            senderName: currentUser.displayName,
            senderPhoto: currentUser.photoURL,
            text: message.trim(),
            timestamp: firebase.firestore.Timestamp.fromDate(time),
            id: id
          })
          .then(
            firebase
              .firestore()
              .collection("messages")
              .doc(currentUser.displayName)
              .collection("senders")
              .doc(props.target)
              .collection("messages")
              .add({
                senderName: currentUser.displayName,
                senderPhoto: currentUser.photoURL,
                text: message.trim(),
                timestamp: firebase.firestore.Timestamp.fromDate(time),
                id: id
              })
          )
          .then(setMessage(""));
        setNewMessage(5);
        updateLastMessage();
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Listens for updates from database for chat logs
  // and updates them to the state
  const getChat = async () => {
    try {
      await firebase
        .firestore()
        .collection("messages")
        .doc(currentUser.displayName)
        .collection("senders")
        .doc(props.target)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot(querySnapshot => {
          setMessages([]);
          querySnapshot.forEach(doc => {
            setMessages(oldArr => [...oldArr, doc.data()]);
          });
        });
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(
    () => {
      getChat();
    },
    //eslint-disable-next-line
    []
  );

  return (
    <KeyboardAvoidingView
      behavior="height"
      enabled
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 120 })}
    >
      <View style={styles.mainWrapper}>
        <View>
          <Spinner
            visible={isLoading}
            textContent={"Loading..."}
            textStyle={styles.spinnerTextStyle}
          />
          <FlatList
            ref={inputEl}
            data={messages}
            inverted
            keyExtractor={item => item.id}
            renderItem={({ item }) =>
              messages.length > 0 ? (
                <View
                  key={item.id}
                  style={
                    item.senderName === currentUser.displayName
                      ? styles.senderPosition
                      : styles.receiverPosition
                  }
                >
                  <View style={styles.senderWrapper}>
                    <View>
                      <Image
                        source={{ uri: item.senderPhoto }}
                        style={styles.avatar}
                      />
                    </View>
                    <View style={styles.senderInfo}>
                      <Text style={styles.senderName}>{item.senderName}</Text>
                      <Text style={styles.timestamp}>
                        {item.timestamp
                          .toDate()
                          .toString()
                          .substring(16, 21)}
                      </Text>
                    </View>
                  </View>
                  <View>
                    {item.senderName === currentUser.displayName ? (
                      <View style={styles.sender}>
                        <Text>{item.text}</Text>
                      </View>
                    ) : (
                      <View style={styles.receiver}>
                        <Text>{item.text}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ) : null
            }
          ></FlatList>

          <View style={styles.sendingWrapper}>
            <View>
              <TextInput
                value={message}
                onChangeText={text => setMessage(text)}
                style={styles.input}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={sendMessage}
              >
                <Icon
                  name="send"
                  type="material"
                  iconStyle={{ fontSize: 30, color: "#fff", padding: 2 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: Dimensions.get("window").width,
    paddingHorizontal: 10
  },
  sendingWrapper: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    height: 80,
    alignItems: "center"
  },
  senderWrapper: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    height: 80,
    alignItems: "center"
  },
  input: {
    width: Dimensions.get("window").width * 0.75,
    borderColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderRadius: 55,
    padding: 10,
    margin: 5,
    height: 50
  },
  buttonWrapper: {
    justifyContent: "center",
    alignItems: "center"
  },
  buttonTextReg: {
    color: "#00d1b2",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    padding: 10
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50
  },
  senderName: {
    fontSize: 18
  },
  sender: {
    backgroundColor: "#dbf4fd",
    padding: 10,
    borderRadius: 15,
    alignSelf: "flex-start",
    maxWidth: 350
  },
  senderPosition: {
    alignItems: "flex-start"
  },
  receiver: {
    backgroundColor: "rgba(0,0,0,0.04)",
    padding: 10,
    borderRadius: 15,
    alignSelf: "flex-start",
    maxWidth: 350
  },
  senderInfo: {
    marginLeft: 10
  },
  timestamp: {
    fontSize: 12,
    color: "grey"
  },
  iconWrapper: {
    backgroundColor: "#00d1b2",
    padding: 10,
    borderRadius: 50,
    marginLeft: 5
  },
  spinnerTextStyle: {
    color: "white"
  }
});

export default SingleChat;

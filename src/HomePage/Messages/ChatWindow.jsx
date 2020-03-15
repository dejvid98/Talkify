import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image
} from "react-native";
import { Icon } from "react-native-elements";
import { AppContext } from "../../../Context";
import firebase from "../../../firebase";
import Spinner from "react-native-loading-spinner-overlay";

const ChatWindow = ({ navigation }) => {
  const { targetContext } = useContext(AppContext);
  const [target, setTarget] = targetContext;
  const [newMessage, setNewMessage] = useState(1);
  const targetCapitalized =
    target.charAt(0).toUpperCase() + target.substring(1);
  const inputEl = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = firebase.auth().currentUser;
  let unsubscribe;

  const updateLastMessage = async () => {
    const time = new Date();
    let receiverPhoto = "";
    const storage = firebase.storage();
    const storageRef = storage.ref();

    try {
      await storageRef
        .child("avatars/" + target.toLowerCase().trim())
        .getDownloadURL()
        .then(function(url) {
          receiverPhoto = url;
        });
    } catch (error) {
      await firebase
        .firestore()
        .collection("users")
        .doc(target.toLowerCase().trim())
        .get()
        .then(doc => {
          receiverPhoto = doc.data().photoURL;
        });
    }

    await firebase
      .firestore()
      .collection("messages")
      .doc(target)
      .collection("senders")
      .doc(currentUser.displayName)
      .set({
        message: message.trim(),
        timestamp: firebase.firestore.Timestamp.fromDate(time),
        senderPhoto: currentUser.photoURL,
        receiver: target,
        senderName: currentUser.displayName,
        receiverPhoto
      });
    await firebase
      .firestore()
      .collection("messages")
      .doc(currentUser.displayName)
      .collection("senders")
      .doc(target)
      .set({
        message: message.trim(),
        timestamp: firebase.firestore.Timestamp.fromDate(time),
        senderPhoto: currentUser.photoURL,
        receiver: currentUser.displayName,
        senderName: target,
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
          .doc(target)
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
              .doc(target)
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
      unsubscribe = await firebase
        .firestore()
        .collection("messages")
        .doc(currentUser.displayName)
        .collection("senders")
        .doc(target)
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

      return function cleanup() {
        unsubscribe();
      };
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
            onPress={() => {
              navigation.goBack();
            }}
            containerStyle={styles.icon}
            iconStyle={styles.iconStyle}
          />
        </View>
        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>{targetCapitalized}</Text>
        </View>
      </View>
      <View style={styles.chatWrapper}>
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
                          <Text style={styles.senderName}>
                            {item.senderName}
                          </Text>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#fff"
  },
  titleWrapper: {
    flex: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    flex: 1,
    maxHeight: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#05AC72",
    flexDirection: "row"
  },
  titleText: {
    position: "relative",
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    top: 30,
    right: 25
  },

  chatWrapper: {
    flexDirection: "column",
    width: Dimensions.get("window").width,
    flex: 1
  },

  icon: {
    backgroundColor: "rgba(0,0,0,0)",
    top: 28
  },
  iconStyle: {
    fontSize: 35,
    color: "white"
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
  },
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
  }
});

export default ChatWindow;

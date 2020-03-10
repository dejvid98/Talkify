import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions
} from "react-native";
import firebase from "../../firebase";

const SingleChat = props => {
  const [messages, setMessages] = useState([]);
  const currentUser = firebase.auth().currentUser;
  const [message, setMessage] = useState("");
  const inputEl = useRef(null);
  const handleMessage = e => {
    setMessage(e.target.value);
  };

  const sendMessage = async e => {
    const time = new Date().toLocaleString();
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
            text: message,
            timestamp: time
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
                text: message,
                timestamp: time
              })
          )
          .then(setMessage(""));
        inputEl.current.scrollToEnd();
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
      await inputEl.current.scrollToEnd();
    } catch (err) {
      console.log(err);
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
    <View style={styles.mainWrapper}>
      <View>
        <ScrollView ref={inputEl}>
          <View style={{ flexDirection: "column-reverse" }}>
            {messages.length > 0
              ? messages.map((message, index) => {
                  return (
                    <View key={index}>
                      <View style={styles.senderWrapper}>
                        <View>
                          <Image
                            source={{ uri: message.senderPhoto }}
                            style={styles.avatar}
                          />
                        </View>
                        <View style={styles.senderInfo}>
                          <Text style={styles.senderName}>
                            {message.senderName}
                          </Text>
                          <Text style={styles.timestamp}>
                            {message.timestamp}
                          </Text>
                        </View>
                      </View>
                      <View>
                        {message.senderName === currentUser.displayName ? (
                          <View style={styles.sender}>
                            <Text>{message.text}</Text>
                          </View>
                        ) : (
                          <View style={styles.receiver}>
                            <Text>{message.text}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })
              : null}
          </View>
        </ScrollView>
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
              style={styles.buttonReg}
              underlayColor="#fff"
              onPress={sendMessage}
            >
              <Text style={styles.buttonTextReg}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
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
    width: Dimensions.get("window").width * 0.8,
    borderColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    margin: 5,
    height: 60
  },
  buttonWrapper: {
    justifyContent: "center",
    alignItems: "center"
  },
  buttonTextReg: {
    color: "#00d1b2",
    textAlign: "center",
    padding: 10,
    fontSize: 20,
    fontWeight: "bold"
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
    flexWrap: "wrap"
  },
  senderInfo: {
    marginLeft: 10
  },
  timestamp: {
    fontSize: 12,
    color: "grey"
  }
});
export default SingleChat;

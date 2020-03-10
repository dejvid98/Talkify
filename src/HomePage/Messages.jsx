import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import SendMessage from "./SendMessage";
import firebase from "../../firebase";
import { AppContext } from "../../Context";
import SingleChat from "./SingleChat";

const Home = () => {
  const [isSending, setIsSending] = useState(false);
  const [isChatting, setIsChatting] = useState(true);
  const [senders, setSenders] = useState([]);
  const [target, setTarget] = useState("daki");
  const { isLoggedInContext, newMessageContext } = useContext(AppContext);

  //eslint-disable-next-line
  const [isLoggedIn, setIsLoggedIn] = isLoggedInContext;
  const [newMessage, setNewMessage] = newMessageContext;

  const currentUser = firebase.auth().currentUser;
  const sendersData = [];

  // Checks to see with whom user has active chats with
  const getSenders = async () => {
    sendersData.length = 0;
    try {
      await firebase
        .firestore()
        .collection("messages")
        .doc(currentUser.displayName)
        .collection("senders")
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(sender => {
            sendersData.push(sender.data());
          });
          setSenders(sendersData);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(
    () => {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          getSenders();
        } else {
          return;
        }
      });
    },
    //eslint-disable-next-line
    [newMessage]
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Messages</Text>
      </View>
      {isSending ? <SendMessage /> : null}
      <ScrollView style={styles.chatWrapper}>
        {isChatting ? (
          <SingleChat target={target} />
        ) : senders.length > 0 ? (
          senders.map(sender => {
            return (
              <View style={styles.messageWrapper}>
                <View style={styles.avatarWrapper}>
                  {sender.senderPhoto === currentUser.photoURL ? (
                    <Image
                      source={{ uri: sender.receiverPhoto }}
                      style={styles.senderAvatar}
                    />
                  ) : (
                    <Image
                      source={{ uri: sender.senderPhoto }}
                      style={styles.senderAvatar}
                    />
                  )}
                </View>

                <View style={styles.senderWrapper}>
                  {sender.senderName === currentUser.displayName ? (
                    <Text style={styles.sender}>{sender.receiver}</Text>
                  ) : (
                    <Text style={styles.sender}>{sender.senderName}</Text>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <View>
            <Text>You don't have any messages</Text>
          </View>
        )}
      </ScrollView>
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
    backgroundColor: "#4ede9a"
  },
  titleText: {
    position: "relative",
    marginTop: 65,
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold"
  },
  senderAvatar: {
    width: 120,
    height: 120,
    borderRadius: 20,
    flex: 1
  },
  messageWrapper: {
    flexDirection: "row",
    borderBottomColor: "black",
    borderBottomWidth: 3,
    paddingBottom: 5
  },
  chatWrapper: {
    flexDirection: "row",
    flex: 1
  },
  avatarWrapper: {
    height: 120,
    width: 120
  },
  senderWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 300
  },
  sender: {
    fontSize: 40
  }
});

export default Home;

import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";
import SendMessage from "./SendMessage";
import firebase from "../../firebase";
import SingleChat from "./SingleChat";
import { Icon } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
import { AppContext } from "../../Context";

const Home = () => {
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [senders, setSenders] = useState([]);
  // const [target, setTarget] = useState("");
  const currentUser = firebase.auth().currentUser;
  const { targetContext, isChattingContext, newMessageContext } = useContext(
    AppContext
  );
  const [target, setTarget] = targetContext;
  const [isChatting, setIsChatting] = isChattingContext;
  const [newMessage, setNewMessage] = newMessageContext;

  // Checks to see with whom user has active chats with
  const getSenders = async () => {
    try {
      await firebase
        .firestore()
        .collection("messages")
        .doc(currentUser.displayName)
        .collection("senders")
        .onSnapshot(querySnapshot => {
          setSenders([]);
          querySnapshot.forEach(sender => {
            setSenders(oldArr => [...oldArr, sender.data()]);
          });
        });
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.log(err);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleSend = () => {
    setIsSending(false);
    setIsChatting(false);
  };

  const openChat = target => {
    setTarget(target);
    setIsChatting(true);
  };

  useEffect(
    () => {
      getSenders();
    },
    //eslint-disable-next-line
    [newMessage]
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.title}>
        <View style={{ flex: 3 }}>
          {isChatting || isSending ? (
            <Icon
              name="arrow-left"
              type="font-awesome"
              onPress={() => {
                setIsSending(false);
                setIsChatting(false);
              }}
              containerStyle={styles.icon}
              iconStyle={{ fontSize: 35, color: "white" }}
            />
          ) : null}
        </View>
        <View
          style={{ flex: 20, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.titleText}>Messages</Text>
        </View>
      </View>
      {isSending ? (
        <SendMessage handleSend={handleSend} />
      ) : (
        <View style={styles.chatWrapper}>
          {isChatting ? (
            <SingleChat target={target} />
          ) : isLoading ? (
            <Spinner
              visible={isLoading}
              textContent={"Loading..."}
              textStyle={styles.spinnerTextStyle}
            />
          ) : senders.length > 0 ? (
            senders.map((sender, index) => {
              const senderName = sender.senderName;
              const receiverName = sender.receiver;
              const senderCapitalized =
                senderName.charAt(0).toUpperCase() + senderName.substring(1);
              const receiverCapitalized =
                receiverName.charAt(0).toUpperCase() +
                receiverName.substring(1);
              return (
                <View key={index}>
                  <TouchableOpacity
                    style={styles.messageWrapper}
                    onPress={() =>
                      sender.senderName === currentUser.displayName
                        ? openChat(sender.receiver)
                        : openChat(sender.senderName)
                    }
                  >
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
                        <View style={{ flexDirection: "row" }}>
                          <View>
                            <Text style={styles.sender}>
                              {receiverCapitalized}
                            </Text>
                          </View>
                          <View
                            style={{
                              alignItems: "flex-end",
                              flex: 1,
                              right: 30
                            }}
                          >
                            <Text style={{ fontSize: 16, marginTop: 10 }}>
                              {sender.timestamp
                                .toDate()
                                .toString()
                                .substring(16, 24)}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View style={{ flexDirection: "row", flex: 1 }}>
                          <View>
                            <Text style={styles.sender}>
                              {senderCapitalized}
                            </Text>
                          </View>
                          <View
                            style={{
                              alignItems: "flex-end",
                              flex: 1,
                              right: 30
                            }}
                          >
                            <Text style={{ fontSize: 16, marginTop: 10 }}>
                              {sender.timestamp
                                .toDate()
                                .toString()
                                .substring(16, 24)}
                            </Text>
                          </View>
                        </View>
                      )}
                      <View style={{ flexDirection: "row", marginTop: 5 }}>
                        <Icon
                          name="check"
                          type="material"
                          iconStyle={{
                            color: "black",
                            fontSize: 16,
                            padding: 2
                          }}
                        />
                        <Text style={{ color: "#787878", fontSize: 16 }}>
                          {sender.message}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyInboxWrapper}>
              <Text style={styles.emptyInbox}>
                Your inbox is currently empty
              </Text>
            </View>
          )}

          {isChatting ? null : (
            <View style={styles.chatIcon}>
              <TouchableOpacity
                onPress={() => {
                  setIsSending(true);
                }}
                style={styles.iconWrapper}
              >
                <Icon
                  name="send"
                  type="material"
                  iconStyle={{ fontSize: 30, color: "white", padding: 2 }}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#fff"
  },
  title: {
    flex: 1,
    maxHeight: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#128c7e",
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
  senderAvatar: {
    width: 80,
    height: 80,
    borderRadius: 80,
    flex: 1
  },
  messageWrapper: {
    flexDirection: "row",
    borderBottomColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 0.6,
    width: Dimensions.get("window").width,
    paddingBottom: 8
  },
  chatWrapper: {
    flexDirection: "column",
    width: Dimensions.get("window").width,
    flex: 1
  },
  avatarWrapper: {
    height: 80,
    width: 80,
    marginTop: 5,
    marginLeft: 5
  },
  senderWrapper: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    left: 20,
    flex: 1
  },
  sender: {
    fontSize: 27,
    top: 5,
    flex: 1
  },
  icon: {
    backgroundColor: "rgba(0,0,0,0)",
    top: 28
  },
  chatIcon: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    margin: 20
  },
  iconWrapper: {
    backgroundColor: "#25d366",
    padding: 20,
    borderRadius: 60
  },
  spinnerTextStyle: {
    color: "#FFF"
  },
  emptyInboxWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    top: 120
  },
  emptyInbox: {
    fontSize: 20,
    color: "rgba(0,0,0,0.4)"
  }
});

export default Home;

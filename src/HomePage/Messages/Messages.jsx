import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from "react-native";
import SendMessage from "./SendMessage";
import firebase from "../../../firebase";
import { Icon } from "react-native-elements";
import { AppContext } from "../../../Context";
import { useFocusEffect } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";

const Home = ({ navigation }) => {
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [senderSearch, setSenderSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [senders, setSenders] = useState([]);
  const currentUser = firebase.auth().currentUser;
  const { targetContext, isChattingContext } = useContext(AppContext);
  const [target, setTarget] = targetContext;
  const [isChatting, setIsChatting] = isChattingContext;
  let unSubscribe;

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setIsSending(false);
        handleSearchClose();
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const findSender = (text) => {
    setSenderSearch(text);

    const filteredSenders = senders.filter((sender) =>
      sender.senderName.startsWith(senderSearch.toLowerCase())
    );

    setSenders(filteredSenders);
  };

  // Checks to see with whom user has active chats with
  const getSenders = async () => {
    try {
      unSubscribe = await firebase
        .firestore()
        .collection("messages")
        .doc(currentUser.displayName)
        .collection("senders")
        .onSnapshot((querySnapshot) => {
          setSenders([]);
          querySnapshot.forEach((sender) => {
            setSenders((oldArr) => [...oldArr, sender.data()]);
          });
        });
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (err) {
      console.log(err);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const handleSend = () => {
    setIsSending(false);
    setIsChatting(false);
  };

  const openChat = (target) => {
    setTarget(target);
    navigation.navigate("SingleChatWindow");
  };

  const handleSearchClose = () => {
    if (isSearching) {
      setIsSearching(false);
      getSenders();
      setSenderSearch("");
    } else {
      setIsSearching(true);
    }
  };

  useEffect(
    () => {
      getSenders();
      return function cleanup() {
        unSubscribe();
      };
    },
    //eslint-disable-next-line
    []
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
          style={{
            flex: 20,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text style={styles.titleText}>Messages</Text>
          {isSearching ? (
            <TextInput
              style={styles.searchInput}
              value={senderSearch}
              onChangeText={(text) => findSender(text)}
            />
          ) : null}

          <View style={styles.serachIconWrapper}>
            <Icon
              name="search"
              type="material"
              iconStyle={{ fontSize: 30, color: "white" }}
              onPress={handleSearchClose}
            />
          </View>
        </View>
      </View>
      {isSending ? (
        <SendMessage handleSend={handleSend} />
      ) : (
        <View style={styles.chatWrapper}>
          {senders.length > 0 ? (
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
                    onPress={() => {
                      senderName === currentUser.displayName
                        ? openChat(receiverName)
                        : openChat(senderName);
                    }}
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
                              right: 30,
                            }}
                          >
                            <Text style={{ fontSize: 13, marginTop: 12 }}>
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
                              right: 30,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                marginTop: 10,
                                color: "#787878",
                              }}
                            >
                              {sender.timestamp
                                .toDate()
                                .toString()
                                .substring(16, 24)}
                            </Text>
                          </View>
                        </View>
                      )}
                      <View
                        style={{
                          flexDirection: "row",
                          marginBottom: 5,
                        }}
                      >
                        <Icon
                          name="check"
                          type="material"
                          iconStyle={{
                            color: "black",
                            fontSize: 16,
                            padding: 2,
                          }}
                        />
                        <Text
                          style={{
                            color: "#787878",
                            fontSize: 16,
                          }}
                        >
                          {sender.message.length > 30
                            ? sender.message.trim().substring(0, 30) + "..."
                            : sender.message.trim()}
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
    backgroundColor: "#fff",
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
    flex: 5,
    fontFamily: "Lato-Regular",
    letterSpacing: 1,
    right: 25,
  },
  senderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    flex: 1,
  },
  messageWrapper: {
    flexDirection: "row",
    borderBottomColor: "rgba(0,0,0,0.08)",
    borderBottomWidth: 0.6,
    width: Dimensions.get("window").width,
    paddingBottom: 15,
  },
  chatWrapper: {
    flexDirection: "column",
    width: Dimensions.get("window").width,
    flex: 1,
  },
  avatarWrapper: {
    height: 50,
    width: 50,
    marginTop: 15,
    marginLeft: 10,
  },
  senderWrapper: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    left: 20,
    flex: 1,
  },
  sender: {
    fontSize: 20,
    top: 10,
    flex: 1,
  },
  icon: {
    backgroundColor: "rgba(0,0,0,0)",
    top: 28,
  },
  chatIcon: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    margin: 15,
  },
  iconWrapper: {
    backgroundColor: "#4ecca3",
    padding: 15,
    borderRadius: 60,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  emptyInboxWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    top: 120,
  },
  emptyInbox: {
    fontSize: 20,
    color: "rgba(0,0,0,0.4)",
  },
  searchInput: {
    borderBottomColor: "white",
    borderBottomWidth: 2,
    top: 20,
    width: 120,
    color: "white",
    fontSize: 18,
    padding: -10,
  },
  serachIconWrapper: {
    top: 20,
    flex: 1,
  },
});

export default Home;

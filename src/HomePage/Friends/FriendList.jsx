import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import firebase from "../../../firebase";
import { AppContext } from "../../../Context";
import { useNavigation } from "@react-navigation/native";

const FriendList = () => {
  const navigation = useNavigation();
  const currentUser = firebase.auth().currentUser;
  const { targetContext } = useContext(AppContext);
  const [target, setTarget] = targetContext;
  const [friends, setFriends] = useState([]);
  const db = firebase.firestore();
  let unsubscribe;

  const capitalizedWord = (word) => {
    return word.charAt(0).toUpperCase() + word.substring(1);
  };

  const openChat = (friend) => {
    setTarget(friend);
    navigation.navigate("SingleChatWindow");
  };

  const getFriendList = async () => {
    unsubscribe = await db
      .collection("friends")
      .doc(currentUser.displayName)
      .collection("friendList")
      .onSnapshot((querySnapshot) => {
        setFriends([]);
        querySnapshot.forEach((sender) => {
          setFriends((oldArr) => [...oldArr, sender.data()]);
        });
      });
  };

  useEffect(
    () => {
      getFriendList();

      return function cleanup() {
        unsubscribe();
      };
    },
    //eslint-disable-next-line
    []
  );

  return (
    <View>
      {friends.length > 0 ? (
        friends.map((friend, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => openChat(friend.friendName)}
            >
              <View style={styles.friendWrapper}>
                <Image
                  source={{ uri: friend.friendPhoto }}
                  style={styles.friendAvatar}
                />
                <View style={styles.friendNameWrapper}>
                  <Text style={styles.friendName}>
                    {capitalizedWord(friend.friendName)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <View style={styles.emptyFriendListWrapper}>
          <Text style={styles.emptyFriendList}>You don't have any friends</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  friendWrapper: {
    flexDirection: "row",
    borderBottomColor: "rgba(0,0,0,0.08)",
    borderBottomWidth: 0.6,
    width: Dimensions.get("window").width,
    paddingBottom: 3,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 80,
    margin: 5,
  },
  friendNameWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  friendName: {
    fontSize: 25,
    right: 20,
  },
  emptyFriendListWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Dimensions.get("window").height * 0.3,
  },
  emptyFriendList: {
    fontSize: 20,
    color: "rgba(0,0,0,0.4)",
  },
});

export default FriendList;

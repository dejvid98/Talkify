import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image
} from "react-native";
import firebase from "../../firebase";
import { Icon } from "react-native-elements";
import { AppContext } from "../../Context";
import { useNavigation } from "@react-navigation/native";

const FriendList = () => {
  const navigation = useNavigation();
  const currentUser = firebase.auth().currentUser;
  const { targetContext, isChattingContext } = useContext(AppContext);
  const [isChatting, setIsChatting] = isChattingContext;
  const [target, setTarget] = targetContext;
  const [friends, setFriends] = useState([]);
  const db = firebase.firestore();

  const capitalizedWord = word => {
    return word.charAt(0).toUpperCase() + word.substring(1);
  };

  const openChat = friend => {
    setTarget(friend);
    setIsChatting(true);
    navigation.navigate("Messages");
  };

  const getFriendList = async () => {
    await db
      .collection("friends")
      .doc(currentUser.displayName)
      .collection("friendList")
      .onSnapshot(querySnapshot => {
        setFriends([]);
        querySnapshot.forEach(sender => {
          setFriends(oldArr => [...oldArr, sender.data()]);
        });
      });
  };

  useEffect(
    () => {
      getFriendList();
    },
    //eslint-disable-next-line
    []
  );

  return (
    <ScrollView>
      {friends.length > 0
        ? friends.map((friend, index) => {
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
        : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  friendWrapper: {
    flexDirection: "row",
    borderBottomColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 0.6,
    width: Dimensions.get("window").width,
    paddingBottom: 3
  },
  friendAvatar: {
    width: 80,
    height: 80,
    borderRadius: 80,
    margin: 5
  },
  friendNameWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  friendName: {
    fontSize: 30
  }
});

export default FriendList;

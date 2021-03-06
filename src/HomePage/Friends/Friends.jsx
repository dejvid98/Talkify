import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Icon } from "react-native-elements";
import FriendList from "./FriendList";
import { ScrollView } from "react-native-gesture-handler";
import { AppContext } from "../../../Context";

const Friends = ({ navigation }) => {
  const { targetContext, isChattingContext } = useContext(AppContext);
  const [target, setTarget] = targetContext;
  const [isChatting, setIsChatting] = isChattingContext;

  useEffect(
    () => {
      setTarget("");
      setIsChatting(false);
    },
    //eslint-disable-next-line
    []
  );
  return (
    <View style={styles.wrapper}>
      <View style={styles.title}>
        <View style={{ flex: 3 }}></View>
        <View
          style={{ flex: 20, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.titleText}>Friends</Text>
        </View>
      </View>
      <ScrollView>
        <FriendList />
      </ScrollView>

      <View style={styles.chatIcon}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AddFriend");
          }}
          style={styles.iconWrapper}
        >
          <Icon
            name="person-add"
            type="material"
            iconStyle={{
              fontSize: 25,
              color: "white",
              padding: 2,
              fontWeight: "bold",
            }}
          />
        </TouchableOpacity>
      </View>
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
    right: 25,
    letterSpacing: 2,
  },

  icon: {
    backgroundColor: "rgba(0,0,0,0)",
    top: 28,
  },
  chatIcon: {
    position: "absolute",
    top: Dimensions.get("window").height - 100,
    left: Dimensions.get("window").width - 80,
  },
  iconWrapper: {
    backgroundColor: "#4ecca3",
    padding: 15,
    borderRadius: 60,
  },
});

export default Friends;

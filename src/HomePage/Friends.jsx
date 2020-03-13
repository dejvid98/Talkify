import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import firebase from "../../firebase";
import { Icon } from "react-native-elements";
import AddFriend from "./AddFriend";
import FriendList from "./FriendList";
import { ScrollView } from "react-native-gesture-handler";

const Friends = () => {
  const currentUser = firebase.auth().currentUser;
  const [isAddding, setIsAdding] = useState(false);

  useEffect(
    () => {},
    //eslint-disable-next-line
    []
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.title}>
        <View style={{ flex: 3 }}>
          {isAddding ? (
            <Icon
              name="arrow-left"
              type="font-awesome"
              containerStyle={styles.icon}
              iconStyle={{ fontSize: 35, color: "white" }}
              onPress={() => setIsAdding(false)}
            />
          ) : null}
        </View>
        <View
          style={{ flex: 20, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.titleText}>Friends</Text>
        </View>
      </View>
      {isAddding ? null : (
        <ScrollView
          style={{ maxHeight: Dimensions.get("window").height * 0.79 }}
        >
          <FriendList />
        </ScrollView>
      )}

      {isAddding ? (
        <AddFriend />
      ) : (
        <View style={styles.chatIcon}>
          <TouchableOpacity
            onPress={() => {
              setIsAdding(true);
            }}
            style={styles.iconWrapper}
          >
            <Icon
              name="person-add"
              type="material"
              iconStyle={{
                fontSize: 30,
                color: "white",
                padding: 2,
                fontWeight: "bold"
              }}
            />
          </TouchableOpacity>
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
    position: "absolute",
    top: Dimensions.get("window").height - 110,
    left: Dimensions.get("window").width - 94
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

export default Friends;

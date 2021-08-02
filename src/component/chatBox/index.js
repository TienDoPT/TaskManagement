import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Card, CardItem } from "native-base";
import { deviceWidth } from "../../utility/styleHelper/appStyle";
import { uuid } from "../../utility/constants";
import styles from "./styles";
import { color } from "../../utility";
import { TouchableOpacity } from "react-native-gesture-handler";


const ChatBox = ({ name, userId, msg, img, onImgTap, onTextPress }) => {

  let isCurrentUser = userId === uuid ? true : false;
  return (
    <Card
      transparent
      style={{
        maxWidth: deviceWidth / 2 + 10,
        alignSelf: isCurrentUser ? "flex-end" : "flex-start",
      }}
    >
      <View style={[isCurrentUser && {display: 'none'},{padding: 5}]}>
        {name ?
          <Text>{name}</Text>
          :
          null}
      </View>
      <View
        style={[
          styles.chatContainer,
          isCurrentUser && {
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 15,
            marginRight: 5,
            backgroundColor: color.HUNRE_GREEN,
          },
        ]}
      >
        {img ? (
          <CardItem cardBody>
            <TouchableOpacity onPress={onImgTap}>
              <Image
                source={{ uri: img }}
                resizeMode="cover"
                style={{ height: 200, width: deviceWidth / 2 }}
              />
            </TouchableOpacity>
          </CardItem>
        ) : (

          <Text
            style={[styles.chatTxt, isCurrentUser && { color: color.WHITE }]}
            selectable
          >
            {msg}
          </Text>

        )}
      </View>
    </Card>
  );
};

export default ChatBox;

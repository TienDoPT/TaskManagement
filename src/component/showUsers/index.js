import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Card, CardItem, Left, Body, Thumbnail, View } from "native-base";
import styles from "./styles";
import Feather from 'react-native-vector-icons/Feather';
import { globalStyle, color } from "../../utility";
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const ShowUsers = ({ name, img, onImgTap, onNameTap, onDel, onAdd, rule }) => {

  return (
    <Card style={styles.cardStyle}>
      <CardItem style={styles.cardItemStyle}>
        <Left>
          <TouchableOpacity style={[styles.logoContainer]} onPress={onImgTap}>
            {img ? (
              <Thumbnail source={{ uri: img }} resizeMode="cover" />
            ) : (
              <Text style={styles.thumbnailName}>{name.charAt(0).toUpperCase()}</Text>
            )}
          </TouchableOpacity>

          <Body style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between" }}>
            <Text style={styles.profileName} onPress={onNameTap}>
              {name}
            </Text>
            {rule ?
              <View style={{ display: "flex", flexDirection: 'row'}}>
                
                <FontAwesome
                  name="edit"
                  size={30}
                  onPress={onAdd}
                  color={color.WHITE}
                  style={{marginRight:20, paddingTop:2}}

                />
                <Feather
                  name="delete"
                  size={30}
                  onPress={onDel}
                  color={color.WHITE}
                />
              </View> : null
            }

          </Body>
        </Left>
      </CardItem>
    </Card >
  );
};

export default ShowUsers;

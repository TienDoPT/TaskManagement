import React, { useContext, useLayoutEffect, useState, useEffect } from 'react'
import { View, Text, FlatList, Platform } from 'react-native'
import styles from "./styles";
import { InputField, ChatBox } from "../../component";
import { appStyle, color, globalStyle } from '../../utility';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import firebase from '../../firebase/config';
import * as ImagePicker from 'expo-image-picker';
import { senderMsg, receiverMsg } from "../../network";
import { Store } from '../../context/store';
import { LOADING_START, LOADING_STOP } from '../../context/actions/type'
import * as FileSystem from 'expo-file-system';

const Chat = ({ route, navigation }) => {
  const globalState = useContext(Store);
  const { dispatchLoaderAction } = globalState;

  const { params } = route;
  const { name, img, imgText, guestUserId, currentUserId } = params;
  const [msgValue, setMsgValue] = useState("");
  const [messages, setMessages] = useState([])


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: <Text>{name}</Text>,
    });
  }, [navigation]);

  useEffect(() => {
    dispatchLoaderAction({
      type: LOADING_START,
    });
    try {
      firebase
        .database()
        .ref("messages")
        .child(currentUserId)
        .child(guestUserId)
        .on('value', (dataSnapshot) => {
          let msgs = [];
          dataSnapshot.forEach((child) => {
            msgs.push({
              sendBy: child.val().message.sender,
              receivedBy: child.val().message.receiver,
              msg: child.val().message.msg,
              img: child.val().message.img,
            })
          })
          setMessages(msgs.reverse());
          dispatchLoaderAction({
            type: LOADING_STOP,
          });
        })
    } catch (error) {
      alert("loi " + error);
      dispatchLoaderAction({
        type: LOADING_STOP,
      });
    }

    // return () => {
    //   cleanup
    // }
  }, [])

//moment(item.createAt?.toDate()).fromNow()

  const handleSend = () => {
    setMsgValue("");
    if (msgValue) {
      senderMsg(msgValue, currentUserId, guestUserId, '')
        .then(() => { })
        .catch((err) => alert(err));
      receiverMsg(msgValue, currentUserId, guestUserId, '')
        .then(() => { })
        .catch((err) => alert(err));
    }

  }

  const handleCamera = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      // let source = result.uri;
      let source = '';
      if (Platform.OS === 'web') {
        source = result.uri;  
      } else {
        const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
        source = "data:image/jpeg;base64,"+ base64;
      }
      senderMsg(msgValue, currentUserId, guestUserId, source)
        .then(() => { })
        .catch((err) => alert(err));
      receiverMsg(msgValue, currentUserId, guestUserId, source)
        .then(() => { })
        .catch((err) => alert(err));
    }
  };

  const handleOnChange = (text) => {
    setMsgValue(text);
  };

 

  return (
    <View style={[globalStyle.flex1, { backgroundColor: color.WHITE }]}>
      <FlatList
      removeClippedSubviews={false}
        inverted
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) =>
          <ChatBox

            userId={item?.sendBy}
            msg={item?.msg}
            img={item?.img}
          />
        }

      />

      <View style={styles.sendMessageContainer}>
        <View style={styles.sendBtnContainer}>
          <MaterialCommunityIcons
            name="camera"
            color={color.HUNRE_GREEN}
            size={appStyle.fieldHeight}
            onPress={() => handleCamera()}
          />
        </View>

        <InputField
          placeholder="Aa"
          numberOfLines={10}
          inputStyle={styles.input}
          value={msgValue}
          onChangeText={(text) => handleOnChange(text)}
        />
        <View style={styles.sendBtnContainer}>
          <MaterialCommunityIcons
            name="send-circle"
            color={color.HUNRE_GREEN}
            size={appStyle.fieldHeight}
            onPress={() => handleSend()}
          />
        </View>

      </View>

    </View>
  )
}
export default Chat;
import React, { useLayoutEffect, useContext, useState, useEffect } from 'react'
import { View, Text, Alert, Platform, FlatList } from 'react-native'
import { LOADING_START, LOADING_STOP } from '../../context/actions/type'
import { HUNRE_GREEN } from '../../utility/colors';
import { Store } from '../../context/store';
import firebase from "../../firebase/config";
import { groupMessages } from "../../network";
import styles from '../../container/chat/styles'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { appStyle, color, globalStyle } from '../../utility';
import { InputField, ChatBox } from "../../component";
import * as ImagePicker from 'expo-image-picker';
import { uuid } from '../../utility/constants';


import * as FileSystem from 'expo-file-system';

export default function GroupChat({ route, navigation }) {

    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;
    const [userName, setUserName] = useState([])

    const { params } = route;
    const { groupId, groupName, host, members } = params;
    const [msgValue, setMsgValue] = useState("");
    const [messages, setMessages] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: <Text>Phòng chat {groupName}</Text>,
        });
    }, [navigation]);

    useEffect(() => {
        dispatchLoaderAction({
            type: LOADING_START,
        });
        try {
            firebase
                .database()
                .ref('groupMessages/' + groupId)

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

    const handleSend = () => {
        setMsgValue("");
        if (msgValue) {
            groupMessages(msgValue, uuid, groupId, '')
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
            let source = '';
            if (Platform.OS === 'web') {
              source = result.uri;  
            } else {
              const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
              source = "data:image/jpeg;base64,"+ base64;
            }
            groupMessages(msgValue, uuid, groupId, source)
                .then(() => { })
                .catch((err) => alert(err));
        }
    };

    useEffect(() => {
        try {
            firebase
                .database()
                .ref('users')
                .on("value", (snapshot) => {
                    let members = []
                    snapshot.forEach((res) => {
                        members.push({
                            id: res.val().uuid,
                            name: res.val().name,
                        })
                    })
                    setUserName(members)
                })
        } catch (error) {
            return error;
        }
    }, [])

    const handleOnChange = (text) => {
        setMsgValue(text);
    };

    const getName = (uid) => {
        let name = ""

        userName.forEach((res) => {
            if (res.id == uid) {
                name = res.name
            }
        })
        if (!name) {
            return 'Loading...'
        }
        return name
    }

    return (
        <View style={[globalStyle.flex1, { backgroundColor: color.WHITE }]}>
            <FlatList
                removeClippedSubviews={false}
                inverted
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) =>
                    <ChatBox
                        name={getName(item?.sendBy)}
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

import React, { useLayoutEffect, useContext, useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { InputField } from '../../component';
import { color, globalStyle, appStyle } from '../../utility';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import styles from "../../container/chat/styles";
import { Store } from '../../context/store';
import { AddGroup } from '../../network/group';
import { uuid } from '../../utility/constants';
import { LOADING_START, LOADING_STOP } from '../../context/actions/type';
import firebase from "../../firebase/config";
import { HUNRE_GREEN } from '../../utility/colors';


export default function Group({ navigation }) {
    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;

    const [groupName, setGroupName] = useState("")

    const [allGroup, setAllGroup] = useState([])

    const [userName, setUserName] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({

            headerLeft: () => (
                <SimpleLineIcons
                    name="menu"
                    size={26}
                    color={color.WHITE}
                    style={{ left: 15 }}
                    onPress={() => {
                        navigation.replace("Home")
                    }}
                />
            ),
        });
    }, [navigation]);

    //Send data
    const handleOnChange = (text) => {
        setGroupName(text);
    }

    const handleSend = () => {
        setGroupName("");
        let gnArr = allGroup.map(res => res.groupName);
        if (groupName) {
            if (gnArr.includes(groupName) == false) {
                let list = [uuid];
                AddGroup(groupName, uuid, list)
                    .then(() => { })
                    .catch((error) => alert(error));
            } else {
                alert('Tên nhóm đã tồn tại vui lòng chọn tên khác!')
            }
        } else {
            alert('Vui lòng nhập tên nhóm!')
        }
    }

    // const checkName = (name) => {
    //     let gnArr = allGroup.map(res => res.groupName);
    //     if(gnArr.includes(name) == false) {
    //         //your code
    //     } else {
    //         alert('this name has taken!')
    //     }
    // }

    //get data
    useEffect(() => {
        dispatchLoaderAction({
            type: LOADING_START,
        });
        try {
            firebase
                .firestore()
                .collection("groups")
                .onSnapshot((querySnapshot) => {
                    let groups = [];
                    querySnapshot.forEach((doc) => {
                        // console.log(doc.id, " => ", doc.data().groupName);
                        // doc.data() is never undefined for query doc snapshots
                        let cond = doc.data().members;
                        cond.forEach((child) => {
                            if (child === uuid) {
                                groups.push({
                                    groupId: doc.id,
                                    groupName: doc.data().groupName,
                                    host: doc.data().host,
                                    members: doc.data().members
                                });
                            }
                        })
                    });
                    setAllGroup(groups);
                    dispatchLoaderAction({
                        type: LOADING_STOP,
                    });
                });

        } catch (error) {
            alert(error);
            dispatchLoaderAction({
                type: LOADING_STOP,
            });
        }
        // return () => {
        //     cleanup
        // }
    }, [])

    useEffect(() => {
        (async function () {
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
                console.log(error);
            }
        })();
    }, [])

    const selectGroup = (groupId, groupName, host, members) => {
        navigation.navigate("GroupDetails", {
            groupId,
            groupName,
            host,
            members
        })
    }

    const getName = (uid) => {
        let name = ""
        if (userName) {
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

    }

    return (
        <View style={{ flex: 1 }}>
            <View style={[styles.sendMessageContainer, { marginLeft: "5%" }]}>
                <InputField
                    placeholder="Aa"
                    numberOfLines={10}
                    inputStyle={[styles.input, { width: "80%", backgroundColor: "green" }]}
                    value={groupName}
                    onChangeText={(text) => handleOnChange(text)}
                />
                <View style={styles.sendBtnContainer}>
                    <MaterialIcons
                        name="add-circle"
                        color={color.HUNRE_GREEN}
                        size={appStyle.fieldHeight}
                        onPress={() => handleSend()}
                    />
                </View>
            </View>
            {/* list */}
            <View style={[globalStyle.flex1, { backgroundColor: HUNRE_GREEN }]}>
                <FlatList
                    alwaysBounceVertical={false}
                    data={allGroup}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => selectGroup(item.groupId, item.groupName, item.host, item.members)}>
                            <View style={{ margin: 10, backgroundColor: "white", display: 'flex', flexDirection: 'column', padding: 15, borderRadius: 15, alignItems: 'center' }}>
                                <Text style={style.text}>Nhóm: {item.groupName}</Text>
                                <Text style={style.text}>Thành viên: {item.members.length}</Text>
                                <Text style={style.text}>Quản lý: {getName(item?.host)}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />

            </View>
        </View>
    )
}

const style = StyleSheet.create({
    text: {
        fontSize: 18,
        fontWeight: '700',
    }
})
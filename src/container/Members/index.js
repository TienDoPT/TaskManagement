import React, { useLayoutEffect, useContext, useState, useEffect } from 'react'
import { View, Text, Alert, Platform, FlatList } from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { color, globalStyle } from '../../utility';
import { Profile, ShowUsers } from '../../component';
import { uuid } from '../../utility/constants';
import { LOADING_START, LOADING_STOP } from '../../context/actions/type'
import { HUNRE_GREEN } from '../../utility/colors';
import { Store } from '../../context/store';
import firebase from "../../firebase/config";
import Dialog from "react-native-dialog";
import { GroupMemberMod } from '../../network/group'

const Members = ({ route, navigation }) => {
    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;

    const { params } = route;
    const { groupId, groupName, host, members } = params;

    const [state, setState] = useState(members)

    const [userDetail, setUserDetail] = useState({
        id: '',
        name: '',
        profileImg: '',
    });

    const { name, profileImg } = userDetail;

    const [allUsers, setAllUsers] = useState([]);

    const [visible, setVisible] = useState(false);

    const [textInput, setTextInput] = useState("")

    //modal
    const showDialog = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    useLayoutEffect(() => {
        navigation.setOptions({

            headerRight: () => (
                <SimpleLineIcons
                    name="user-follow"
                    size={26}
                    color={color.WHITE}
                    style={{ right: 15 }}
                    onPress={showDialog}
                />
            ),

        });
    }, []);

    useEffect(() => {
        dispatchLoaderAction({
            type: LOADING_START,
        });

        try {
            firebase
                .database()
                .ref('users')
                .on("value", (dataSnapShot) => {
                    let users = [];
                    let currentUser = {
                        id: "",
                        name: "",
                        profileImg: "",
                    }
                    dataSnapShot.forEach((child) => {
                        if (host === child.val().uuid) {
                            currentUser.id = uuid;
                            currentUser.name = child.val().name;
                            currentUser.profileImg = child.val().profileImg;
                        } else {
                            state.forEach((res) => {
                                if (child.val().uuid == res) {
                                    users.push({
                                        id: child.val().uuid,
                                        name: child.val().name,
                                        profileImg: child.val().profileImg,
                                    });
                                }
                            })
                        }
                    });
                    setUserDetail(currentUser);
                    setAllUsers(users);
                    dispatchLoaderAction({
                        type: LOADING_STOP,
                    });
                })
        } catch (error) {
            alert(error);
            dispatchLoaderAction({
                type: LOADING_STOP,
            });
        }
    }, [state])

    const handleOnChange = (text) => {
        setTextInput(text);
    }

    const addHandle = () => {
        if (textInput.length == 28) {
            if(members?.includes(textInput) == false) {
                let input = [...members, textInput]
                GroupMemberMod(groupId, input)
                    .then(() => { })
                    .catch((error) => alert(error));
                setState(input)
            } else {
                alert('Ng?????i n??y ???? ??? trong nh??m.')
            }
        } else {
            alert('UID kh??ng h???p l???.')
        }
        setVisible(false);
    }

    const delUser = (idUser) => {
        let newState = [...state]
        let memberIndex = newState.indexOf(idUser);
        newState.splice(memberIndex, 1);
        GroupMemberMod(groupId, newState)
            .then(() => { })
            .catch((error) => alert(error));
        setState(newState)
    }

    const confirmDel = (idUser) => {
        if (host == uuid) {
            if (Platform.OS === 'web') {
                delUser(idUser)
            } else {
                Alert.alert(
                    "X??c nh???n",
                    "B???n c?? ch???c mu???n x??a ng?????i n??y kh???i nh??m?",
                    [
                        {
                            text: "C??",
                            onPress: () => delUser(idUser),
                        },
                        {
                            text: "Kh??ng",
                        },
                    ],
                    { cancelable: false }
                )
            }
        } else {
            Alert.alert(
                "X??c nh???n",
                "B???n c?? ch???c mu???n x??a ng?????i n??y kh???i nh??m?",
                [
                    {
                        text: "C??",
                        onPress: () => alert('B???n kh??ng ????? th???m qu???n. Vui l??ng li??n h??? qu???n tr??? vi??n.')
                    },
                    {
                        text: "Kh??ng",
                    },
                ],
                { cancelable: false }
            )
        }

    }

    const groupRules = () => {
        if(host == uuid) {
            return true
        } else {
            return false
        }
    }

    const addToDo = (idGroup, idUser) => {
        navigation.navigate('ToDo', {
            idGroup, idUser
        })
    }

    return (
        <View style={[globalStyle.flex1, { backgroundColor: HUNRE_GREEN }]}>
            <FlatList
                alwaysBounceVertical={false}
                data={allUsers}
                keyExtractor={(_, index) => index.toString()}
                ListHeaderComponent={
                    <Profile
                        img={profileImg}
                        name={name}
                    />}
                renderItem={({ item }) => (
                    <ShowUsers
                        name={item.name}
                        img={item.profileImg}
                        onDel={() => confirmDel(item.id)}
                        onAdd={()=> addToDo(groupId, item.id)}
                        rule={groupRules()}
                    />
                )}
            />

            

            <View style={[globalStyle.containerCentered]}>
                <Dialog.Container visible={visible}>
                    <Dialog.Title>Th??m th??nh vi??n</Dialog.Title>
                    <Dialog.Input placeholder="Nh???p UID..." onChangeText={(text) => handleOnChange(text)} />
                    <Dialog.Button label="X??c nh???n" onPress={() => addHandle()} />
                    <Dialog.Button label="H???y" onPress={handleCancel} />
                </Dialog.Container>
            </View>
        </View>

    )
}

export default Members;
import React, { useLayoutEffect, useState, useEffect, useContext } from 'react'
import { View, Text, FlatList, Alert } from 'react-native'
import firebase from '../../firebase/config';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { color, globalStyle } from '../../utility';
import { Store } from '../../context/store';
import Entypo from 'react-native-vector-icons/Entypo';
import { LOADING_START, LOADING_STOP } from '../../context/actions/type'
import { uuid } from '../../utility/constants';
import { DARK_GREEN, HUNRE_GREEN } from '../../utility/colors';
import Octicons from 'react-native-vector-icons/Octicons';
import { DelTodo, UpdateTodo } from '../../network'

export default function GroupDetails({ route, navigation }) {
    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;
    const [allUsers, setAllUsers] = useState([]);

    const { params } = route;
    const { groupId, groupName, host, members } = params;

    const [userDetail, setUserDetail] = useState({
        id: '',
        name: '',
        profileImg: '',
    });

    const [todo, setTodo] = useState([])

    const { id, name, profileImg } = userDetail;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: DARK_GREEN, elevation:0  },
            headerTitle: <Text>Nhóm: {groupName}</Text>,
            headerRight: () => (
                <View style={[globalStyle.containerCentered, { flexDirection: "row", justifyContent: "space-between" }]}>
                    <SimpleLineIcons
                        name="people"
                        size={28}
                        color={color.WHITE}
                        style={{ margin: 10 }}
                        onPress={() => {
                            navigation.navigate("Thành viên", { groupId, groupName, host, members });
                        }}
                    />
                    <Entypo
                        name="chat"
                        size={28}
                        color={color.WHITE}
                        style={{ margin: 10 }}
                        onPress={() => {
                            navigation.navigate("GroupChat", { groupId, groupName, host, members, id });

                        }}
                    />
                </View>
            ),

        });

    }, []);

    useEffect(() => {

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
                        if (uuid === child.val().uuid) {
                            currentUser.id = uuid;
                            currentUser.name = child.val().name;
                            currentUser.profileImg = child.val().profileImg;
                        } else {
                            users.push({
                                id: child.val().uuid,
                                name: child.val().name,
                                profileImg: child.val().profileImg,
                            });
                        }
                    });
                    setUserDetail(currentUser);
                    setAllUsers(users);

                })
        } catch (error) {
            alert(error);

        }
    }, [])

    const formatDate = (date) => {
        const dateArr = date.split("-");
        const [a, b, c] = dateArr;
        const newDate = [c, b, a]
        return newDate.join("/")

    }

    useEffect(() => {
        dispatchLoaderAction({
            type: LOADING_START,
        });
        try {
            firebase
                .firestore()
                .collection("todos")
                .onSnapshot((querySnapshot) => {
                    let todo = [];
                    querySnapshot.forEach((doc) => {
                        let date = doc.data().deadline.toDate().toISOString().slice(0, 10)
                        let cond = doc.data().groupId;
                        if (cond === groupId) {
                            todo.push({
                                todoId: doc.id,
                                deadline: formatDate(date),
                                todo: doc.data().todo,
                                status: doc.data().status,
                                userId: doc.data().userId
                            });
                        }
                    });
                    setTodo(todo);
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

    const getName = (uid) => {
        if (uid == id) {
            return name
        } else {
            let name = ""
            allUsers.forEach((res) => {
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

    const finishedTodo = () => {
        let count = 0;
        todo?.forEach(res => {
            if (res.status == true) {
                count++
            }
        })
        return  count
    }

    const todoCount = () => {
        if(todo?.length !== 0){
            let total = todo?.length
            return (finishedTodo() / total * 100).toFixed()
        }else {
            return 0
        }
        
    }

    return (
        <View style={[globalStyle.flex1, { backgroundColor: DARK_GREEN, paddingTop: 15}]}>

        <View style={[globalStyle.flex1, { backgroundColor: HUNRE_GREEN, borderTopStartRadius: 33, borderTopEndRadius: 33}]}>
            <Text style={{fontWeight:'bold', width: '100%', textAlign: 'center', fontSize: 28, color: color.WHITE, padding: '2%'}}>Danh Sách Công Việc</Text>
            <FlatList
                alwaysBounceVertical={false}
                data={todo}
                keyExtractor={(_, index) => index.toString()}
                ListHeaderComponent={() => (
                    <View style={{ alignSelf: 'center', flexDirection: 'row', borderBottomWidth:2 }}>
                        <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: color.WHITE, width: 50, height: 50, borderRadius: 25, borderWidth: 3, margin: 5 }}>
                            <Text style={{fontWeight:'bold', fontSize:17}}>{todoCount()}%</Text>
                        </View>
                        <View style={{alignSelf: 'center', margin: 5}}>
                            <Text>Đã được giao: {todo?.length}</Text>
                            <Text>Đã hoàn thành: {finishedTodo()}</Text>
                        </View>
                    </View>
                )}
                renderItem={({ item }) => (

                    <View style={{borderBottomWidth:2,borderRightWidth:2, borderRadius: 15, display: 'flex', flexDirection: 'row', margin: 10, backgroundColor: item.status ? "green" : "white", }}>
                        <View style={{ padding: 5, display: 'flex', flexDirection: 'column', width: '80%' }}>
                            <Text style={{ fontSize: 22 }}>Công việc: {item.todo}</Text>
                            <Text>- Người thực hiện: {getName(item.userId)}.</Text>
                            <Text>- Tình trạng: {item?.status ? 'Đã hoàn thành' : 'Chưa hoàn thành'}.</Text>
                            <Text>- Thời hạn kết thúc: {item.deadline}.</Text>
                        </View>
                        {uuid == host ?
                            <Octicons
                                style={{ alignSelf: 'center', padding: 5 }}
                                name="trashcan"
                                size={28}
                                onPress={() => {
                                    Alert.alert(
                                        'Xác nhận',
                                        'Bạn có chắc muốn xóa công việc này?',
                                        [
                                            {
                                                text: 'Có',
                                                onPress: () => DelTodo(item.todoId)
                                            },
                                            {
                                                text: 'Không'
                                            }
                                        ]
                                    )
                                }}
                            /> : null
                        }
                        {item.userId == uuid || host == uuid ?
                            <SimpleLineIcons
                                style={{ alignSelf: 'center', padding: 5 }}
                                name="check"
                                size={28}
                                onPress={() => {
                                    UpdateTodo(item.todoId, item.status)
                                }}
                            /> : null
                        }

                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                        <Text>Chưa thêm công việc</Text>
                    </View>
                )}
            />

        </View>
        </View>
    )
}

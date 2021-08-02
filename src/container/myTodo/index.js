import React, { useLayoutEffect, useState, useEffect, useContext } from 'react'
import { View, Text, FlatList, Alert } from 'react-native'
import firebase from '../../firebase/config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { color, globalStyle } from '../../utility';
import { Store } from '../../context/store';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { LOADING_START, LOADING_STOP } from '../../context/actions/type'
import { uuid } from '../../utility/constants';
import { HUNRE_GREEN } from '../../utility/colors';
import Octicons from 'react-native-vector-icons/Octicons';
import { DelTodo, UpdateTodo } from '../../network'

export default function MyTodo({ navigation }) {
    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;

    const [userDetail, setUserDetail] = useState({
        id: '',
        name: '',
        profileImg: '',
    });

    const [todo, setTodo] = useState([])

    const { id, name, profileImg } = userDetail;
    let idGroup = '';
    let idUser = uuid;
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Công việc',

            headerRight: () => (
                <View style={[globalStyle.containerCentered, { flexDirection: "row", justifyContent: "space-between" }]}>
                    <MaterialIcons
                        name="add-circle-outline"
                        size={30}
                        color={color.WHITE}
                        style={{ margin: 10 }}
                        onPress={() => {
                            navigation.navigate('ToDo', {
                                idGroup, idUser
                            })
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
                        }
                    });
                    setUserDetail(currentUser);
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
                        let cond = doc.data().userId;
                        if (cond === uuid) {
                            todo.push({
                                todoId: doc.id,
                                deadline: formatDate(date),
                                todo: doc.data().todo,
                                status: doc.data().status,
                                groupId: doc.data().groupId
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

    // const getName = (uid) => {
    //     if (uid == id) {
    //         return name
    //     } else {
    //         let name = ""
    //         allUsers.forEach((res) => {
    //             if (res.id == uid) {
    //                 name = res.name
    //             }
    //         })
    //         if (!name) {
    //             return 'Loading...'
    //         }
    //         return name
    //     }
    // }

    const finishedTodo = () => {
        let count = 0;
        todo?.forEach(res => {
            if (res.status == true) {
                count++
            }
        })
        return count
    }

    const todoCount = () => {
        if(todo?.length !== 0){
            let total = todo.length
            return (finishedTodo() / total * 100).toFixed()
        }else {
            return 0
        }
        
    }

    return (
        <View style={[globalStyle.flex1, { backgroundColor: HUNRE_GREEN }]}>
            <FlatList
                alwaysBounceVertical={false}
                data={todo}
                keyExtractor={(_, index) => index.toString()}
                ListHeaderComponent={() => (
                    <View style={{ alignSelf: 'center', flexDirection: 'row', borderBottomWidth:2 }}>
                        <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: color.WHITE, width: 50, height: 50, borderRadius: 25, borderWidth: 3, margin: 5 }}>
                            <Text style={{fontWeight:'bold', fontSize:16}}>{todoCount()}%</Text>
                        </View>
                        <View style={{alignSelf: 'center', margin: 5}}>
                            <Text>Đã được giao: {todo?.length}</Text>
                            <Text>Đã hoàn thành: {finishedTodo()}</Text>
                        </View>
                    </View>
                )}
                renderItem={({ item }) => (

                    <View style={{ borderRadius: 15, display: 'flex', flexDirection: 'row', margin: 10, backgroundColor: item?.status ? "green" : "white", }}>
                        <View style={{ padding: 5, display: 'flex', flexDirection: 'column', width: '80%' }}>
                            <Text style={{ fontSize: 22 }}>Công việc: {item.todo}</Text>
                            <Text>- Tình trạng: {item?.status ? 'Đã hoàn thành' : 'Chưa hoàn thành'}.</Text>
                            <Text>- Thời hạn kết thúc: {item.deadline}.</Text>
                        </View>
                        {
                            !item.groupId ?
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

                        <SimpleLineIcons
                            style={{ alignSelf: 'center', padding: 5 }}
                            name="check"
                            size={28}
                            onPress={() => {
                                UpdateTodo(item?.todoId, item?.status)
                            }}
                        />

                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                        <Text>Chưa thêm công việc</Text>
                    </View>
                )}
            />

        </View>
    )
}

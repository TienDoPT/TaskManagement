import React, { useLayoutEffect, useState, useEffect, useContext } from 'react'
import { View, ImageBackground, Platform, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { LogOutUser } from '../../network';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { color, globalStyle } from '../../utility';
import { clearAsyncStorage } from '../../asyncStorage';
import { HUNRE_GREEN } from '../../utility/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import { LOADING_START, LOADING_STOP } from '../../context/actions/type'
// import { Store } from '../../context/store';
// import firebase from "../../firebase/config";
// import { uuid } from '../../utility/constants';


const Home = ({ navigation }) => {
    // const [seen, setSeen] = useState(false)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Danh Mục',

            headerRight: () => (
                <SimpleLineIcons
                    name="logout"
                    size={26}
                    color={color.WHITE}
                    style={{ right: 15 }}
                    onPress={() => {
                        if (Platform.OS === 'web') {
                            logout()
                        } else {
                            Alert.alert(
                                "Đăng xuất",
                                "Bạn có chắc muốn đăng xuất?",
                                [
                                    {
                                        text: "Có",
                                        onPress: () => logout(),
                                    },
                                    {
                                        text: "Không",
                                    },
                                ],
                                { cancelable: false }
                            )
                        }
                    }}
                />
            ),
            // headerLeft : () => (
            //     img ? (
            //         <Thumbnail source={{ uri: img }} resizeMode="cover" />
            //       ) : (
            //         <Text style={styles.thumbnailName}>{name.charAt(0).toUpperCase()}</Text>
            //       )
            // )
        });
    }, []);

    const logout = () => {
        LogOutUser()
            .then(() => {
                clearAsyncStorage()
                    .then(() => {
                        navigation.replace('Login')
                    })
                    .catch((err) => alert(err))
            })
            .catch((err) => alert(err))
    }

    // useEffect(() => {
    //     firebase
    //         .firestore()
    //         .collection("todos").where("seen", "==", false)
    //         .onSnapshot((querySnapshot) => {
    //             querySnapshot.forEach((doc) => {
    //                 // doc.data() is never undefined for query doc snapshots
    //                 console.log(doc.data().userId);
    //                 let cond = doc.data().userId
    //                 if (cond == uuid) {
    //                     setSeen(true)
    //                 }
    //                 console.log(seen)
    //             });
    //         })


    // }, [])

    return (
        <View style={globalStyle.containerCentered}>
            <TouchableOpacity style={style.container} onPress={() => navigation.replace("Dashboard")}>
                <MaterialCommunityIcons
                    name="view-dashboard"
                    size={28}
                    color={color.WHITE}
                />
                <Text style={style.text}>Mọi người</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.container} onPress={() => navigation.replace("Group")}>
                <MaterialCommunityIcons
                    name="account-group"
                    size={28}
                    color={color.WHITE}
                />
                <Text style={style.text}>Hội nhóm </Text>
                {/* {!seen? <Text style={{color:"rbg(255,255,0)"}}>(Mới)</Text> : null} */}
            </TouchableOpacity>
            <TouchableOpacity style={style.container} onPress={() => navigation.navigate("MyTodo")}>
                <FontAwesome5
                    name="tasks"
                    size={28}
                    color={color.WHITE}
                />
                <Text style={style.text}>Công việc</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.container} onPress={() => navigation.navigate("Tìm kiếm")}>
                <FontAwesome5
                    name="search"
                    size={28}
                    color={color.WHITE}
                />
                <Text style={style.text}>Tìm kiếm</Text>
            </TouchableOpacity>
            <Text style={{ fontStyle: 'italic' }}>HunreTeams is Powered by <Text style={{ textDecorationLine: 'underline' }}>ⒸTienDo.</Text></Text>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        width: '80%',
        height: '20%',
        backgroundColor: HUNRE_GREEN,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    text: {
        fontSize: 28,
        fontWeight: 'bold',
        color: color.WHITE
    }
})

export default Home;

import React, { useLayoutEffect, useContext, useState, useEffect } from 'react'
import { View, Text, Alert, Platform, FlatList } from 'react-native'
import { appStyle, color, globalStyle } from '../../utility';
import { InputField, ShowUsers } from '../../component';
import { uuid } from '../../utility/constants';
import { LOADING_START, LOADING_STOP } from '../../context/actions/type'
import { HUNRE_GREEN } from '../../utility/colors';
import { Store } from '../../context/store';
import firebase from "../../firebase/config";
import styles from '../chat/styles';
import Ionicons from "react-native-vector-icons/Ionicons";


const Search = ({ navigation }) => {
    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;

    const [allUsers, setAllUsers] = useState([]);

    const [search, setSearch] = useState('')
    const [result, setResult] = useState([])
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
                    dataSnapShot.forEach((child) => {
                        if (uuid !== child.val().uuid) {
                            users.push({
                                id: child.val().uuid,
                                name: child.val().name,
                                profileImg: child.val().profileImg,
                            });
                        }
                    });
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
    }, [])

    const nameTap = (profileImg, name, guestUserId) => {
        if (!profileImg) {
            navigation.navigate('Chat', {
                name,
                imgText: name,
                guestUserId,
                currentUserId: uuid
            })
        } else {
            navigation.navigate('Chat', {
                name,
                img: profileImg,
                guestUserId,
                currentUserId: uuid
            })
        }
    }

    const UserSearch = () => {
        if(search) {
            setSearch('')
            let filter = [];
            allUsers?.forEach(res=>{
                console.log(res.name)
                if(res.name.includes(search)){
                    filter.push(res)
                }
            })
            if(filter.length === 0) {
                alert('Không tìm thấy kết quả phù hợp!')
            }
            setResult(filter)

        }
    }

    return (
        <View style={[globalStyle.flex1, { backgroundColor: HUNRE_GREEN }]}>
            <FlatList
                alwaysBounceVertical={false}
                data={result}
                keyExtractor={(_, index) => index.toString()}
                ListHeaderComponent={
                    <View style={[styles.sendMessageContainer, { marginLeft: "5%" }]}>
                        <InputField
                            placeholder="Aa"
                            numberOfLines={10}
                            value={search}
                            onChangeText={(text)=>setSearch(text)}
                            inputStyle={[styles.input, { width: "80%", backgroundColor: "green" }]}
                        />
                        <View style={styles.sendBtnContainer}>
                            <Ionicons
                                name="search-circle"
                                color={color.DARK_GREEN}
                                size={appStyle.fieldHeight}
                                onPress={() => UserSearch()}
                            />
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <ShowUsers
                        name={item?.name}
                        img={item?.profileImg}
                        onNameTap={() => nameTap(item.profileImg, item.name, item.id)}
                    />
                )}
            />

        </View>
    )
}

export default Search;
import React, { useLayoutEffect, useContext, useState, useEffect } from 'react'
import { View, Text, Alert, Platform, FlatList } from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { UpdateUser } from '../../network';
import { color, globalStyle } from '../../utility';
import { Profile, ShowUsers } from '../../component';
import { uuid } from '../../utility/constants';
import { LOADING_START, LOADING_STOP } from '../../context/actions/type'
import { HUNRE_GREEN } from '../../utility/colors';
import { Store } from '../../context/store';
import firebase from "../../firebase/config";
import * as ImagePicker from 'expo-image-picker';
import Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';

const Dashboard = ({ navigation }) => {
  const globalState = useContext(Store);
  const { dispatchLoaderAction } = globalState;

  const [userDetail, setUserDetail] = useState({
    id: '',
    name: '',
    profileImg: '',
  });

  const { name, profileImg } = userDetail;

  const [allUsers, setAllUsers] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Mọi người',

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
      headerRight: () => (
        <MaterialIcons
          name="content-copy"
          size={28}
          color={color.WHITE}
          style={{ right: 15 }}
          onPress={() => {
            copyToClipboard()
          }}
        />
      ),

    });
  }, []);

  const copyToClipboard = () => {
    Clipboard.setString(uuid);
    alert('Sao chép UID thành công!')
  };

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

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const selectPhotoTapped = async () => {
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
      // let source = result.uri;
      dispatchLoaderAction({
        type: LOADING_START,
      });
      UpdateUser(uuid, source)
        .then(() => {
          setUserDetail({
            ...userDetail,
            profileImg: source,
          });
          dispatchLoaderAction({
            type: LOADING_STOP,
          });
        })
        .catch(() => {
          alert(err);
          dispatchLoaderAction({
            type: LOADING_STOP,
          });
        });
    }
  };

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
            onEditImgTap={() => selectPhotoTapped()}
          />}
        renderItem={({ item }) => (
          <ShowUsers
            name={item.name}
            img={item.profileImg}
            onNameTap={() => nameTap(item.profileImg, item.name, item.id)}
          />
        )}
      />

    </View>
  )
}

export default Dashboard;
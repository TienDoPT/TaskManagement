import React, { useEffect } from 'react'
import { View } from 'react-native'
import { getAsyncStorage, keys } from '../../asyncStorage';
import { color, globalStyle } from '../../utility';
import { setUniqueValue } from '../../utility/constants';
import Logo from '../../component/logo';
const Splash = ({ navigation }) => {
    useEffect(() => {
        const redirect = setTimeout(() => {
            getAsyncStorage(keys.uuid)
                .then((uuid) => {
                    if (uuid) {
                        setUniqueValue(uuid);
                        navigation.replace('Home');
                    } else {
                        navigation.replace('Login');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    navigation.replace('Login')
                });

        }, 3000)
        return () => clearTimeout(redirect);
    }, [navigation])
    return (
        <View
            style={[globalStyle.containerCentered, { backgroundColor: color.DARK_GREEN }]}>
            <Logo />
        </View>
    )
}
export default Splash;
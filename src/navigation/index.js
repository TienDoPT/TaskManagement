import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ToDo, Members, Login, SignUp, Dashboard, Home, Splash, Chat, Group, GroupDetails, GroupChat, MyTodo, Search } from '../container';
import { color } from '../utility';

const Stack = createStackNavigator();

function NavContainer() {
    return (

        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    headerShown: true,
                    headerStyle: { backgroundColor: color.DARK_GREEN },
                    headerTitleStyle: {
                        fontWeight: "bold",
                        fontSize: 20,
                    },
                    headerTintColor: color.WHITE,
                    headerTitleAlign: "center",
                }}>
                <Stack.Screen
                    name="Splash"
                    component={Splash}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="Dashboard"
                    component={Dashboard}
                    // options={{
                    //     headerLeft: null,
                    // }} 
                    />
                <Stack.Screen
                    name="Home"
                    component={Home}
                />
                <Stack.Screen
                    name="MyTodo"
                    component={MyTodo}
                />
                <Stack.Screen
                    name="Group"
                    component={Group}
                />
                <Stack.Screen
                    name="Chat"
                    component={Chat}
                />
                <Stack.Screen
                    name="ToDo"
                    component={ToDo}
                />
                <Stack.Screen
                    name="GroupDetails"
                    component={GroupDetails}
                />
                <Stack.Screen
                    name="Thành viên"
                    component={Members}
                />
                <Stack.Screen
                    name="GroupChat"
                    component={GroupChat}
                />
                <Stack.Screen
                    name="Tìm kiếm"
                    component={Search}
                />
            </Stack.Navigator>
        </NavigationContainer>


    );
}

export default NavContainer;
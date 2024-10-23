import { createStackNavigator } from "@react-navigation/stack";
import Service from "../../screens/admin/Service";
import AddNewService from "../../screens/admin/AddService";
import ServiceDetail from "../../screens/admin/ServiceDetail";
import { useMyContextController } from "../../context";
import { Avatar, IconButton } from "react-native-paper";
import React from 'react';

const Stack = createStackNavigator();

const RouterHome = ({ navigation }) => {
    const [controller] = useMyContextController(); // You can remove dispatch if you don't need it here
    const { userLogin } = controller;

    return (
        <Stack.Navigator
            initialRouteName="Service"
            screenOptions={{
                headerRight: () => (
                    <Avatar.Icon
                        icon={"account"}
                        onPress={() => navigation.navigate("setting")} // Navigate to settings
                        size={40}
                        style={{
                            backgroundColor: "white",
                            color: "black",
                            margin: 10,
                        }}
                    />
                ),
                headerStyle: {
                    backgroundColor: "pink",
                },
                headerTitleAlign: "center",
            }}
        >
            <Stack.Screen 
                name="Service" 
                component={Service} 
                options={{
                    title: userLogin?.fullName ? userLogin.fullName : "Service", // Optional chaining
                    headerLeft: () => null, // No back button on Service screen
                }} 
            />
            <Stack.Screen 
                name="AddService" 
                component={AddNewService} 
                options={({ navigation }) => ({
                    title: "Add Service", // Set title for AddService screen
                    headerLeft: () => (
                        <IconButton
                            icon="arrow-left"
                            onPress={() => navigation.goBack()} // Navigate back to the previous screen
                            size={20}
                        />
                    ),
                })} 
            />
            <Stack.Screen 
                name="ServiceDetail" 
                component={ServiceDetail} 
                options={({ navigation }) => ({
                    title: "Service Detail", // Set title for ServiceDetail screen
                    headerLeft: () => (
                        <IconButton
                            icon="arrow-left"
                            onPress={() => navigation.goBack()} // Navigate back to the previous screen
                            size={20}
                        />
                    ),
                })} 
            />
        </Stack.Navigator>
    );
};

export default RouterHome;

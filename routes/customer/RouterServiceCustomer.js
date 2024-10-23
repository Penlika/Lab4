import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../../context";
import { Avatar, IconButton } from "react-native-paper";
import ServiceCustomer from "../../screens/customer/ServiceCustomer";
import AddNewAppointment from "../../screens/customer/AddNewAppointment";
import AppointmentDetail from "../../screens/customer/AppointmentDetail";
import React from 'react';

const Stack = createStackNavigator();

const RouterServiceCustomer = ({ navigation }) => {
    const [controller] = useMyContextController();
    const { userLogin } = controller;

    return (
        <Stack.Navigator
            initialRouteName="ServiceCustomer"
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
                name="ServiceCustomer" 
                component={ServiceCustomer} 
                options={{
                    title: userLogin?.fullName ? userLogin.fullName : "Service Customer", // Optional chaining
                    headerLeft: () => null, // No back button on ServiceCustomer screen
                }} 
            />
            <Stack.Screen 
                name="AddNewAppointment" 
                component={AddNewAppointment} 
                options={({ navigation }) => ({
                    title: "Add New Appointment", // Set title for AddNewAppointment screen
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
                name="AppointmentDetail" 
                component={AppointmentDetail} 
                options={({ navigation }) => ({
                    title: "Appointment Detail", // Set title for AppointmentDetail screen
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

export default RouterServiceCustomer;

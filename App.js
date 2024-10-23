import React, { useEffect } from 'react';
import MainRouter from './routes/MainRouter';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { ThemeProvider, useTheme } from './context/ThemeContext'; 
import { MyContextControllerProvider } from './context';
import { View, StyleSheet } from 'react-native';

const Initial = () => {
    const USERS = firestore().collection("USERS");
    const admin = {
        name: "Tho Nguyen",
        phone: "123456",
        address: "Binh Duong",
        email: "superlaferrari@gmail.com",
        role: "admin"
    };

    USERS.doc(admin.email).onSnapshot((doc) => {
        if (!doc.exists) {
            auth().createUserWithEmailAndPassword(admin.email, "1234567")
                .then(() => {
                    USERS.doc(admin.email).set(admin);
                    console.log("Created new account for admin");
                })
                .catch(e => console.log(e));
        }
    });
};

const App = () => {
    useEffect(() => Initial(), []);

    return (
        <MyContextControllerProvider>
            <ThemeProvider>
                <MainApp />
            </ThemeProvider>
        </MyContextControllerProvider>
    );
};

const MainApp = () => {
    const { currentTheme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <NavigationContainer>
                <PaperProvider>
                    <MainRouter />
                </PaperProvider>
            </NavigationContainer>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;

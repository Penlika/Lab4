// Transaction.js
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Import useTheme

const Transaction = () => {
    const { isDarkMode } = useTheme(); // Access dark mode state

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
            <Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 20 }}>Transaction Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});

export default Transaction;

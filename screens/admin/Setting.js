import React from "react";
import { Text, View, StyleSheet, Switch, Button, Alert } from "react-native";
import { useMyContextController, logout } from "../../context/index";
import { useTheme } from "../../context/ThemeContext";

const Setting = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    const { isDarkMode, toggleDarkMode, isEnglish, toggleLanguage, currentLanguage } = useTheme();

    const handleLogout = () => {
        Alert.alert(currentLanguage.confirmLogout, "", [
            { text: "Cancel", style: "cancel" },
            {
                text: currentLanguage.logout,
                onPress: () => {
                    logout(dispatch);
                    navigation.navigate("login", { resetCredentials: true });
                },
            },
        ]);
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
            <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>{currentLanguage.settings}</Text>
            <View style={styles.settingRow}>
                <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>{currentLanguage.darkMode}</Text>
                <Switch
                    value={isDarkMode}
                    onValueChange={async () => {
                        await toggleDarkMode();
                    }}
                />
            </View>
            <View style={styles.settingRow}>
                <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>
                    {isEnglish ? "Language: English" : "Ngôn ngữ: Tiếng Việt"}
                </Text>
                <Switch
                    value={!isEnglish}
                    onValueChange={async () => {
                        await toggleLanguage();
                    }}
                />
            </View>
            <Button title={currentLanguage.logout} onPress={handleLogout} />
        </View>
    );
};

export default Setting;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
});

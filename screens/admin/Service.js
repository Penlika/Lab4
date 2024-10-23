import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, TextInput } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useTheme } from "../../context/ThemeContext"; // Import useTheme

const Service = ({ navigation }) => {
    const [services, setServices] = useState([]);
    const [servicesData, setServicesData] = useState([]);
    const cSERVICES = firestore().collection("SERVICES");
    const [name, setName] = useState("");
    const { isDarkMode } = useTheme(); // Access dark mode state

    // Fetch services from Firestore
    useEffect(() => {
        const unsubscribe = cSERVICES.onSnapshot((response) => {
            const arr = [];
            response.forEach((doc) => arr.push({ id: doc.id, ...doc.data() })); // Include document ID
            setServices(arr);
            setServicesData(arr);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Filter services based on search input
    useEffect(() => {
        setServicesData(services.filter((s) => s.serviceName.includes(name)));
    }, [name, services]);

    // Render individual service item
    const renderItem = ({ item }) => {
        const { serviceName, price } = item;
        return (
            <TouchableOpacity
                style={[styles.itemContainer, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}
                onPress={() => navigation.navigate("ServiceDetail", { item: item })}
            >
                <Text style={[styles.serviceName, { color: isDarkMode ? '#fff' : '#000' }]}>{serviceName}</Text>
                <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>{price} VND</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
            <Image style={styles.image} source={require("../../image/logolab3.png")} />
            <TextInput
                label={"Search Service by name"}
                style={{ margin: 10 }}
                value={name}
                onChangeText={setName}
                theme={{ colors: { primary: isDarkMode ? '#fff' : '#000' } }} // Change input theme based on mode
            />
            <View style={styles.title}>
                <Text style={[styles.text, { color: isDarkMode ? '#ff6347' : 'red' }]}>Danh sách dịch vụ</Text>
                <TouchableOpacity onPress={() => navigation.navigate("AddService")}>
                    <Avatar.Icon icon={"plus"} style={{ backgroundColor: "red" }} size={40} color="white" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={servicesData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    image: {
        marginTop: 30,
        alignSelf: 'center',
    },
    title: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    text: {
        fontSize: 30,
        fontWeight: "bold",
    },
    itemContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        height: 60,
        borderRadius: 10,
        margin: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    serviceName: {
        fontSize: 25,
        fontWeight: 'bold',
    },
});

export default Service;

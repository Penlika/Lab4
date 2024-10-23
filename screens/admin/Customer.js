// Customer.js
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Import useTheme
import firestore from "@react-native-firebase/firestore";

const Customer = () => {
    const { isDarkMode } = useTheme(); // Access dark mode state
    const [customers, setCustomers] = useState([]); // State to hold customer data

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const customersSnapshot = await firestore()
                    .collection("USERS") // Replace with your users collection name
                    .where("role", "==", "customer") // Query for users with the role of customer
                    .get();

                const customersData = customersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setCustomers(customersData);
            } catch (error) {
                console.error("Error fetching customers: ", error);
            }
        };

        fetchCustomers(); // Call the fetch function
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
            <Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 20 }}>Customer Screen</Text>
            <FlatList
                data={customers}
                keyExtractor={item => item.id} // Use document ID as key
                renderItem={({ item }) => (
                    <View style={[styles.customerItem, { backgroundColor: isDarkMode ? '#444' : '#f9f9f9' }]}>
                        <Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 16 }}>
                            {item.fullName ? item.fullName : "No Name Available"}
                        </Text>
                        <Text style={{ color: isDarkMode ? '#ccc' : '#555', fontSize: 14 }}>
                            {item.email ? item.email : "No Email Available"}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={{ color: isDarkMode ? '#fff' : '#000', textAlign: 'center', marginTop: 20 }}>
                        No customers found.
                    </Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    customerItem: {
        padding: 15,
        marginVertical: 5,
        borderRadius: 5,
    },
});

export default Customer;

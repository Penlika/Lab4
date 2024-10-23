import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Card } from "react-native-paper";
import { useMyContextController } from "../../context";
import DatePicker from 'react-native-date-picker';
import { useTheme } from "../../context/ThemeContext"; // Import Theme Context

const AddNewAppointment = ({ navigation, route }) => {
    const { id } = route.params.item;
    const [service, setService] = useState({});
    const [datetime, setDatetime] = useState(new Date());
    const [controller] = useMyContextController();
    const { userLogin } = controller;
    const [open, setOpen] = useState(false);
    const { currentTheme, currentLanguage } = useTheme(); // Use Theme Context

    const SERVICES = firestore().collection("SERVICES");
    const APPOINTMENTS = firestore().collection("APPOINTMENTS");
    
    useEffect(() => {
        const unsubscribe = SERVICES.doc(id).onSnapshot(response => setService(response.data()));
        return () => unsubscribe();
    }, [id]);
    
    const handleAddNewAppointment = () => {
        APPOINTMENTS.add({
            customerID: userLogin.email,
            serviceID: id,
            datetime,
            state: "new"
        })
        .then(response => APPOINTMENTS.doc(response.id).update({ id: response.id }))
        .then(() => {
            Alert.alert(currentLanguage.serviceUpdated, "", [{ text: "OK" }]);
            navigation.navigate("Appointments");
        })
        .catch(error => {
            console.error("Error adding appointment: ", error);
            Alert.alert(currentLanguage.errorUpdatingService + error);
        });
    };

    return (
        (service != null) && (
            <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
                {/* Service Image */}
                {service.image && (
                    <Image source={{ uri: service.image }} style={styles.image} />
                )}

                {/* Service Details */}
                <Card style={[styles.card, { backgroundColor: currentTheme.background }]}>
                    <Card.Content>
                        <Text style={[styles.serviceName, { color: currentTheme.color }]}>
                            {currentLanguage.serviceName}: {service.serviceName}
                        </Text>
                        <Text style={[styles.servicePrice, { color: currentTheme.color }]}>
                            {currentLanguage.price}: {service.price} USD
                        </Text>
                    </Card.Content>
                </Card>

                {/* DateTime Picker */}
                <TouchableOpacity style={styles.dateTimeContainer} onPress={() => setOpen(true)}>
                    <Text style={[styles.dateTimeText, { color: currentTheme.color }]}>
                        {currentLanguage.chooseDateAndTime}:
                    </Text>
                    <Text style={[styles.dateTime, { color: currentTheme.color }]}>
                        {datetime.toLocaleString()}
                    </Text>
                </TouchableOpacity>

                {/* Add Appointment Button */}
                <Button
                    mode="contained"
                    onPress={handleAddNewAppointment}
                    style={styles.button}
                >Add Appointment
                    {currentLanguage.addNewAppointment}
                </Button>

                {/* DatePicker Modal */}
                <DatePicker
                    modal
                    open={open}
                    date={datetime}
                    onConfirm={(date) => {
                        setOpen(false);
                        setDatetime(date);
                    }}
                    onCancel={() => {
                        setOpen(false);
                    }}
                />
            </View>
        )
    );
};

export default AddNewAppointment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    image: {
        height: 200,
        width: '100%',
        borderRadius: 10,
        marginBottom: 15,
    },
    card: {
        marginBottom: 15,
        padding: 10,
        borderRadius: 10,
        elevation: 2,
    },
    serviceName: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
    },
    servicePrice: {
        fontSize: 18,
    },
    dateTimeContainer: {
        borderWidth: 1,
        borderColor: "#007bff",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "green",
    },
    dateTimeText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    dateTime: {
        fontSize: 16,
    },
    button: {
        backgroundColor: "#007bff",
    },
});


import firestore from "@react-native-firebase/firestore"; 
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { useMyContextController } from "../../context";
import DatePicker from 'react-native-date-picker';

const AppointmentDetail = ({navigation, route}) => {
    const { id } = route.params.item;
    const [appointment, setAppointment] = useState({});
    const [datetime, setDatetime] = useState(new Date());
    const [service, setService] = useState({});
    const [visible, setVisible] = useState(false);
    const [open, setOpen] = useState(false);

    const APPOINTMENTS = firestore().collection("APPOINTMENTS");
    const SERVICES = firestore().collection("SERVICES");

    const hideDialog = () => setVisible(false);

    useEffect(() => {
        // Lấy thông tin cuộc hẹn
        APPOINTMENTS.doc(id).onSnapshot(response => {
            const appointmentData = response.data();
            setAppointment(appointmentData);
            setDatetime(appointmentData.datetime.toDate());
            
            // Lấy thông tin dịch vụ dựa trên serviceID
            SERVICES.doc(appointmentData.serviceID).onSnapshot(serviceResp => {
                setService(serviceResp.data());
            });
        });
    }, [id]);

    const handleUpdateAppointment = () => {
        APPOINTMENTS.doc(id)
            .update({ datetime })
            .then(() => {
                Alert.alert("Success", "Appointment updated successfully");
                navigation.navigate("Appointments");
            })
            .catch(error => console.log(error.message));
    };

    const handleDeleteAppointment = () => {
        APPOINTMENTS.doc(id).delete()
            .then(() => {
                Alert.alert("Success", "Appointment deleted successfully");
                navigation.navigate("Appointments");
            });
    };

    

    return (
        (appointment != null && service != null) && (
        <View style={styles.container}>
            {/* Service name */}
            <Text style={styles.label}>Service Name</Text>
            <TextInput
                value={service.serviceName}
                disabled
            />

            {/* Service Image */}
            {service.image && (
                <Image source={{ uri: service.image }} style={{ height: 300 }} />
            )}

            {/* Date and time */}
            <Text style={styles.label}>Date and Time</Text>
            <Button onPress={() => setOpen(true)}>Change Date & Time</Button>
            <TextInput 
                value={datetime.toLocaleString()}
                disabled
            />

            <DatePicker
                modal
                open={open}
                date={datetime}
                onConfirm={(date) => {
                    setOpen(false);
                    setDatetime(date);
                }}
                onCancel={() => setOpen(false)}
            />

            {/* Update Appointment */}
            <Button
                mode="contained"
                onPress={handleUpdateAppointment}
            >
                Update Appointment
            </Button>

            {/* Delete Confirmation */}
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Confirm Delete Appointment</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to delete this appointment?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={handleDeleteAppointment}>Yes</Button>
                        <Button onPress={hideDialog}>No</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
        )
    );
};

export default AppointmentDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
});

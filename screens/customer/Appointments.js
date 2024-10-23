import { useState, useEffect } from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useMyContextController } from "../../context";

const Appointments = ({ navigation }) => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [search, setSearch] = useState("");
    const APPOINTMENTS = firestore().collection("APPOINTMENTS");
    const SERVICES = firestore().collection("SERVICES");
    const [controller] = useMyContextController();
    const { userLogin } = controller;

    useEffect(() => {
        const unsubscribe = APPOINTMENTS
            .where("customerID", "==", userLogin.email)
            .onSnapshot(async snapshot => {
                const appointmentList = [];
                for (const doc of snapshot.docs) {
                    const appointmentData = doc.data();
                    // Lấy tên dịch vụ từ Firestore dựa trên serviceID
                    const serviceDoc = await SERVICES.doc(appointmentData.serviceID).get();
                    if (serviceDoc.exists) {
                        appointmentList.push({
                            id: doc.id,
                            ...appointmentData,
                            serviceName: serviceDoc.data().serviceName,  // Thêm tên dịch vụ
                        });
                    }
                }
                setAppointments(appointmentList);
                setFilteredAppointments(appointmentList);  // Ban đầu hiển thị tất cả
            });
        
        return () => unsubscribe();  // Clean up on unmount
    }, []);

    useEffect(() => {
        // Lọc các cuộc hẹn dựa trên từ khóa tìm kiếm
        setFilteredAppointments(
            appointments.filter(appointment =>
                appointment.serviceName.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, appointments]);

    const renderItem = ({ item }) => {
        return(
        <TouchableOpacity
            style={styles.appointmentCard}
            onPress={() => navigation.navigate("AppointmentDetail", { item: item })}
        >
            <Text style={styles.textBold}>Service Name: {item.serviceName}</Text>
            <Text>Date and Time: {new Date(item.datetime.seconds * 1000).toLocaleString()}</Text>
            <Text>Status: {item.state}</Text>
        </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>List of Appointments</Text>
            
            {/* Search Input */}
            <TextInput
                label="Search by service name"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
            />
            
            {/* FlatList hiển thị các cuộc hẹn */}
            <FlatList
                data={filteredAppointments}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    appointmentCard: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        marginBottom: 10,
    },
    textBold: {
        fontWeight: "bold",
    },
    searchInput: {
        marginBottom: 15,
    },
});

export default Appointments;

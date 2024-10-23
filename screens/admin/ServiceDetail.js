import React, { useEffect, useLayoutEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { Button, Dialog, HelperText, IconButton, Portal, TextInput } from "react-native-paper";
import { useMyContextController } from "../../context";
import ImagePicker from 'react-native-image-crop-picker';
import storage from "@react-native-firebase/storage";
import { useTheme } from "../../context/ThemeContext";

const ServiceDetail = ({ navigation, route }) => {
    const { id } = route.params.item;
    const [service, setService] = useState({});
    const [controller] = useMyContextController();
    const { userLogin } = controller;

    const { isDarkMode, currentLanguage } = useTheme();

    const hasErrorServiceName = () => service.serviceName === "";
    const hasErrorPrice = () => service.price <= 0;

    const SERVICES = firestore().collection("SERVICES");
    const [visible, setVisible] = useState(false);
    const hideDialog = () => setVisible(false);

    useEffect(() => {
        const unsubscribe = SERVICES.doc(id).onSnapshot(response => {
            setService(response.data());
        });
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [id]);

    const handleUpdateService = async () => {
        try {
            if (service.image && !service.image.startsWith('http')) {
                const refImage = storage().ref(`/services/${id}.png`);
                await refImage.putFile(service.image);
                const link = await refImage.getDownloadURL();
                await SERVICES.doc(id).update({ ...service, create: userLogin.email, image: link });
            } else {
                await SERVICES.doc(id).update({ ...service, create: userLogin.email });
            }

            Alert.alert(currentLanguage.serviceUpdated);
            navigation.navigate("Service");
        } catch (e) {
            console.error("Error updating service: ", e.message);
            Alert.alert(currentLanguage.errorUpdatingService + e.message);
        }
    };

    const handleUploadImage = () => {
        ImagePicker.openPicker({
            mediaType: "photo",
            height: 300,
            width: 400,
            cropping: true
        })
        .then(response => setService({ ...service, image: response.path }))
        .catch(e => {
            console.log(e.message);
            Alert.alert(currentLanguage.failedToPickImage);
        });
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: (props) => (
                <IconButton icon={"delete"} {...props} onPress={() => setVisible(true)} />
            ),
        });
    }, [navigation]);

    const handleDeleteService = async () => {
        try {
            await SERVICES.doc(id).delete();
            Alert.alert(currentLanguage.serviceDeleted);
            navigation.navigate("Service");
        } catch (e) {
            console.error("Error deleting service: ", e.message);
            Alert.alert(currentLanguage.errorDeletingService + e.message);
        }
    };

    return (
        service && (
            <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
                {/* Image */}
                <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>{currentLanguage.image} *</Text>
                <Button onPress={handleUploadImage}>{currentLanguage.uploadImage}</Button>
                {service.image && <Image source={{ uri: service.image }} style={{ height: 300 }} />}

                {/* Service Name */}
                <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>{currentLanguage.serviceName} *</Text>
                <TextInput
                    label={currentLanguage.inputServiceName}
                    value={service.serviceName}
                    onChangeText={(text) => setService({ ...service, serviceName: text })}
                    style={styles.input}
                />
                <HelperText type="error" visible={hasErrorServiceName()}>
                    {currentLanguage.serviceNameError}
                </HelperText>

                {/* Price */}
                <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>{currentLanguage.price} *</Text>
                <TextInput
                    label={currentLanguage.inputPrice}
                    value={service.price ? String(service.price) : ''}
                    onChangeText={(text) => setService({ ...service, price: Number(text) })}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <HelperText type="error" visible={hasErrorPrice()}>
                    {currentLanguage.priceError}
                </HelperText>

                <Button
                    mode="contained"
                    onPress={handleUpdateService}
                    disabled={hasErrorServiceName() || hasErrorPrice()}
                >
                    {currentLanguage.updateService}
                </Button>

                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>{currentLanguage.confirmDeleteService}</Dialog.Title>
                        <Dialog.Content>
                            <Text>{currentLanguage.deleteServicePrompt}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={handleDeleteService}>{currentLanguage.yes}</Button>
                            <Button onPress={hideDialog}>{currentLanguage.no}</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        )
    );
};

export default ServiceDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    input: {
        marginVertical: 10,
    },
});

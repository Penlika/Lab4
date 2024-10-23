import firestore from "@react-native-firebase/firestore";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import ImagePicker from 'react-native-image-crop-picker';
import storage from "@react-native-firebase/storage";
import { useMyContextController } from "../../context";
import { useTheme } from "../../context/ThemeContext"; // Import your theme context

const AddNewService = ({ navigation }) => {
    const [controller] = useMyContextController();
    const { userLogin } = controller;
    const [serviceName, setServiceName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    
    // Get the current language from the theme context
    const { currentLanguage } = useTheme();

    const hasErrorServiceName = () => serviceName === "";
    const hasErrorPrice = () => Number(price) <= 0;

    const SERVICES = firestore().collection("SERVICES");

    const handleAddNewService = async () => {
        const priceValue = Number(price);

        // Validation checks for empty or invalid fields
        if (!serviceName.trim()) {
            Alert.alert(currentLanguage.serviceNameError);
            return;
        }

        if (isNaN(priceValue) || priceValue <= 0) {
            Alert.alert(currentLanguage.priceError);
            return;
        }

        try {
            // Add new service to Firestore
            const response = await SERVICES.add({
                serviceName: serviceName.trim(),
                price: priceValue,
                createBy: userLogin?.fullName || "Unknown",
            });

            // Prepare image reference and upload if an image is selected
            const refImage = storage().ref(`/services/${response.id}.png`);
            if (image) {
                await refImage.putFile(image); // Upload the image
                const link = await refImage.getDownloadURL(); // Get the download URL

                // Update the document with the image link
                await SERVICES.doc(response.id).update({
                    image: link,
                    id: response.id,
                });
            } else {
                await SERVICES.doc(response.id).update({ id: response.id }); // Update without image
            }

            Alert.alert(currentLanguage.serviceUpdated);
            navigation.navigate("Service");
        } catch (error) {
            console.error("Error adding new service: ", error);
            Alert.alert(currentLanguage.errorUpdatingService + error.message);
        }
    };

    const handleUploadImage = async () => {
        try {
            const selectedImage = await ImagePicker.openPicker({
                mediaType: "photo",
                height: 300,
                width: 400,
                cropping: true,
            });
            setImage(selectedImage.path); // Store the image path
        } catch (error) {
            console.log("Image picker error: ", error.message);
            Alert.alert(currentLanguage.failedToPickImage);
        }
    };

    return (
        <View style={style.container}>
            <Text>{currentLanguage.image} *</Text>
            <Button onPress={handleUploadImage}>{currentLanguage.uploadImage}</Button>
            {image && <Image source={{ uri: image }} style={{ height: 300 }} />}

            <Text>{currentLanguage.serviceName} *</Text>
            <TextInput
                label={currentLanguage.inputServiceName}
                value={serviceName}
                onChangeText={setServiceName}
            />
            <HelperText type="error" visible={hasErrorServiceName()}>
                {currentLanguage.serviceNameError}
            </HelperText>

            <Text>{currentLanguage.price} *</Text>
            <TextInput
                value={price}
                label={currentLanguage.inputPrice}
                onChangeText={setPrice}
                keyboardType="numeric"
            />
            <HelperText type="error" visible={hasErrorPrice()}>
                {currentLanguage.priceError}
            </HelperText>

            <Button
                mode="contained"
                onPress={handleAddNewService}
                disabled={hasErrorServiceName() || hasErrorPrice()}
            >
                {currentLanguage.updateService}
            </Button>
        </View>
    );
};

export default AddNewService;

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
});

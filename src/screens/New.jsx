import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function New() {
    const [imageUri, setImageUri] = useState(null);

    const openGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permissão negada!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        } else {
            console.log('Usuário cancelou');
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity style={{ padding: 20, backgroundColor: '#00CCCC' }} onPress={openGallery}>
                <Text>Abrir Galeria</Text>
            </TouchableOpacity>
            {imageUri && <Image source={{ uri: imageUri }} style={{ width: 300, height: 300, marginTop: 20 }} />}
        </View>
    );
}

import React, { useState, useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useChangeProfileMutation } from '@hooks/useProfile';
import { colorContext } from '@context/colorScheme';

async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Permissão para acessar a galeria é necessária!');
        return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        aspect: [1, 1],
    });

    if (result.canceled) return null;
    return result.assets[0];
}

export default function UploadImage() {
    const mutation = useChangeProfileMutation();
    const { isDarkMode } = useContext(colorContext);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createFormData = (photo) => {
        const data = new FormData();
        let uri = photo.uri;
        if (!uri.startsWith('file://')) {
            uri = 'file://' + uri;
        }
        data.append('image', {
            uri,
            name: photo.uri.split('/').pop(),
            type: 'image/jpeg',
        });
        return data;
    };

    const handlePickAndUpload = async () => {
        setError(null);
        setSuccess(false);

        const picked = await pickImage();
        if (!picked) return;

        const formData = createFormData(picked);

        try {
            await mutation.mutateAsync(formData);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Erro no upload');
            console.error('Upload error:', err);
        }
    };

    return (
        <TouchableOpacity onPress={handlePickAndUpload}>
            <MaterialIcons name="edit" size={24} color={isDarkMode ? "#d1cfcf" : "#fff"} />
        </TouchableOpacity>
    );
}

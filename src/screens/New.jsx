import React, { useState } from 'react';
import { Button, View, Text, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '@context/axiosInstance';

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
    });

    if (result.cancelled) return null;
    return result.assets[0]
}

export default function UploadImageScreen() {
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [data, setData] = useState();

    const createFormData = (photo) => {
        const data = new FormData();
        let uri = photo.uri;
        if (!uri.startsWith('file://')) {
            uri = 'file://' + uri;
        }
        data.append('image', {
            uri,
            name: photo.uri.split('/').pop(),
            type: 'image/jpeg',  // Força pra não dar undefined
        });

        return data;
    };

    const handlePickAndUpload = async () => {
        console.log('handlePickAndUpload chamado');

        setError(null);
        setSuccess(false);

        const picked = await pickImage();
        if (!picked) return;

        console.log(photo)
        setPhoto(picked);
        console.log('teste')
        setLoading(true);
        console.log('teste2 ')
        const formData = createFormData(picked);

        console.log('teste3')

        try {
            const { data } = await api.post('/ocr/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // console.log(data)
            setSuccess(true);
            setData({ nome: data.nome_transacao, categoria: data.categoria, valor: data.valor, data_conta: data.data })
            // console.log('Upload response:', data);
        } catch (err) {
            setError(err.message || 'Erro no upload');
            console.error('Upload error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Button title="Selecionar e Enviar Imagem" onPress={handlePickAndUpload} />

            {photo && (
                <Image
                    source={{ uri: photo.uri }}
                    style={{ width: 200, height: 200, marginVertical: 20 }}
                    resizeMode="contain"
                />
            )}

            {loading && <Text>Enviando imagem...</Text>}
            {error && <Text style={{ color: 'red' }}>Erro: {error}</Text>}
            {success && <Text style={{ color: 'green' }}>Upload concluído!</Text>}
            {data && (
                <>
                    <Text style={{ color: 'blue' }}>{data.nome}</Text>
                    <Text style={{ color: 'blue' }}>{data.categoria}</Text>
                    <Text style={{ color: 'blue' }}>{data.valor}</Text>
                    <Text style={{ color: 'blue' }}>{data.data}</Text>
                </>
            )}
        </View>
    );
}

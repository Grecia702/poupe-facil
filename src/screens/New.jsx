import React, { useState, useContext } from 'react';
import { colorContext } from '@context/colorScheme';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '@context/axiosInstance';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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

export default function UploadImageScreen({ fields, setFields, selected, setSelected, categorias }) {
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { isDarkMode } = useContext(colorContext);



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
        console.log('handlePickAndUpload chamado');

        setError(null);
        setSuccess(false);

        const picked = await pickImage();
        if (!picked) return;
        setPhoto(picked);
        setLoading(true);
        const formData = createFormData(picked);

        try {
            const { data } = await api.post('/ocr/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess(true);
            setFields({ ...fields, nome_transacao: data.nome_transacao, categoria: data.categoria, valor: data.valor, data_transacao: data.data, natureza: data.natureza })
            setSelected({ ...selected, categoria: categorias[data.categoria], natureza: data.natureza })
        } catch (err) {
            setError(err.message || 'Erro no upload');
            console.error('Upload error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ marginTop: 8 }}>


            <View style={{ alignItems: 'center' }}>
                {!photo && (
                    <TouchableOpacity style={{ gap: 8 }} onPress={handlePickAndUpload}>
                        <Text style={{ color: isDarkMode ? '#aaa' : '#202020', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                            Toque para {'\n'}selecionar imagem
                        </Text>
                        <View style={[styles.ocrView, { backgroundColor: isDarkMode ? '#444' : '#c4c4c4' }]}>
                            <MaterialIcons name="document-scanner" size={24} color={isDarkMode ? '#aaa' : '#444'} />
                            <Text style={{ color: isDarkMode ? '#aaa' : '#333', fontWeight: '600' }}>
                                OCR
                            </Text>
                        </View>
                        <Text style={{ color: isDarkMode ? '#aaa' : '#202020', fontSize: 14, textAlign: 'center', marginVertical: 12 }}>
                            Após a seleção da imagem do comprovante, as informações serão extraídas automaticamente
                        </Text>
                    </TouchableOpacity>
                )}
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    photo && (
                        <View style={{ flexDirection: 'row', marginLeft: 30 }}>
                            <Image
                                source={{ uri: photo.uri }}
                                style={{ width: 100, height: 200 }}
                                resizeMode="contain"
                            />
                            <TouchableOpacity onPress={() => setPhoto(null)}>
                                <View style={{ borderColor: isDarkMode ? '#aaa' : '#444', borderWidth: 2, borderRadius: 30, padding: 2 }}>
                                    <MaterialIcons name="close" size={24} color={isDarkMode ? '#aaa' : '#444'} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                )}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    ocrView: {
        flexDirection: 'row', alignItems: 'center', alignSelf: 'center', padding: 5, borderRadius: 10, gap: 8
    }
})
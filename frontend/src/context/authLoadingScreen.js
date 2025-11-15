import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@context/authContext';
import { useNavigation } from '@react-navigation/native';

export default function AuthLoadingScreen() {
    const { isAuthenticated, isLoading } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                navigation.replace('home');
            } else {
                navigation.replace('login');
            }
        }
    }, [isLoading, isAuthenticated]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'green' }}>
            <ActivityIndicator size="large" />
        </View>
    );
}

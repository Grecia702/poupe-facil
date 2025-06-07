import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React, { useContext, useEffect } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useProfile } from '@hooks/useProfile'
import { colorContext } from '@context/colorScheme'
import DefaultIcon from '@assets/user-icon.png'
import UploadImage from '@components/uploadProfilePicture'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Profile = () => {
    const { isDarkMode } = useContext(colorContext)
    const navigation = useNavigation()
    const { data } = useProfile()

    useEffect(() => {
        const fetchToken = async () => {
            const token = await AsyncStorage.getItem('expoPushToken')
            console.log(token)
        }
        fetchToken()
    }, [])

    const menuItems = [
        { label: 'Editar Perfil' },
        { label: 'Notificações' },
        { label: 'Segurança' },
        { label: 'Aparência' }
    ]

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f7f7f8' }]}>
            <View style={styles.profileHeader}>
                <View style={styles.profileImageWrapper}>
                    <Image
                        source={
                            typeof data?.picture_path === 'string' && data?.picture_path.length > 0
                                ? { uri: data?.picture_path }
                                : DefaultIcon
                        }
                        style={styles.profileImage}
                    />
                    <View style={[
                        styles.uploadIconWrapper,
                        { backgroundColor: isDarkMode ? '#2680a3' : '#37a9d6' }
                    ]}>
                        <UploadImage />
                    </View>
                </View>
                <Text style={[styles.name, { color: isDarkMode ? '#bbb' : '#111' }]}>
                    {data?.nome}
                </Text>
                <View style={styles.email}>
                    <Text style={styles.emailText}>
                        {data?.email}
                    </Text>
                </View>
            </View>

            <View style={[
                styles.widget,
                {
                    backgroundColor: isDarkMode ? '#222' : '#fffefe',
                    borderColor: isDarkMode ? '#444' : '#ccc'
                }
            ]}>
                {menuItems.map((item, index) => {
                    const isLast = index === menuItems.length - 1
                    return (
                        <Pressable
                            key={item.label}
                            style={({ pressed }) => [
                                styles.menuItem,
                                !isLast && {
                                    borderBottomWidth: 1,
                                    borderBottomColor: isDarkMode ? '#444' : '#ccc'
                                },
                                {
                                    opacity: pressed ? 0.6 : 1,
                                    transform: [{ scale: pressed ? 0.98 : 1 }]
                                }
                            ]}
                        >
                            <Text style={[styles.menuItemLabel, { color: isDarkMode ? '#bbb' : '#111' }]}>
                                {item.label}
                            </Text>
                            <MaterialIcons name="navigate-next" size={24} color={isDarkMode ? '#bbb' : '#111'} />
                        </Pressable>
                    )
                })}
            </View>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    profileHeader: {
        alignItems: 'center',
        paddingTop: 40,
        padding: 20
    },
    profileImageWrapper: {
        marginBottom: 24,
        flexDirection: 'row',
        position: 'relative'
    },
    profileImage: {
        width: 128,
        height: 128,
        borderRadius: 400,
        overflow: 'hidden'
    },
    uploadIconWrapper: {
        position: 'absolute',
        borderRadius: 20,
        padding: 5,
        bottom: 0,
        right: -5
    },
    name: {
        fontSize: 24,
        fontWeight: '400',
        marginBottom: 8
    },
    email: {
        backgroundColor: '#6983d850',
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 30,
        marginTop: 12
    },
    emailText: {
        fontWeight: '600',
        color: '#155ee4'
    },
    widget: {
        borderRadius: 10,
        elevation: 2,
        marginTop: 32
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20
    },
    menuItemLabel: {
        fontSize: 16
    }
})

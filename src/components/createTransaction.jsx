import { useNavigation } from '@react-navigation/native'
import { StyleSheet, View, Modal, TouchableOpacity, Pressable, Text } from 'react-native'
import { useContext, useState } from 'react';
import { colorContext } from '@context/colorScheme';
import { MaterialIcons } from '@expo/vector-icons'

const CreateTransaction = ({ isOpen, setIsOpen }) => {
    const navigation = useNavigation();
    const handleCreateTransaction = (route, tipo) => {
        setTimeout(() => {
            setIsOpen(false)
        }, 100)
        navigation.navigate(route, { tipo: tipo })
    }
    const { isDarkMode } = useContext(colorContext);
    return (
        <Modal visible={isOpen} transparent animationType="fade">
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={setIsOpen} />
                <View style={[styles.modal, { backgroundColor: isDarkMode ? '#363636' : "#c0c0c0" }]}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            {
                                opacity: pressed ? 0.5 : 1.0,
                                transform: [{ scale: pressed ? 1.05 : 1 }]
                            }
                        ]}
                        onPress={() => handleCreateTransaction('CreateTransaction', 'receita')}
                    >
                        <View style={[styles.buttonIcon, { borderColor: "#496ce0", backgroundColor: isDarkMode ? '#464646' : "#c4c4c4" }]}>
                            <MaterialIcons name={"trending-up"} size={32} color={isDarkMode ? "#496ce0" : "#6658df"} />
                        </View>
                        <Text style={[styles.text, { color: isDarkMode ? "#ccc" : "#333" }]}>
                            Criar Receita
                        </Text>
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            {
                                opacity: pressed ? 0.5 : 1.0,
                                transform: [{ scale: pressed ? 1.05 : 1 }]
                            }
                        ]}
                        onPress={() => handleCreateTransaction('CreateTransaction', 'despesa')}
                    >
                        <View style={[styles.buttonIcon, { borderColor: "#cc2929", backgroundColor: isDarkMode ? '#464646' : "#c4c4c4" }]}>
                            <MaterialIcons name={"trending-down"} size={32} color={isDarkMode ? "#cc2929" : "#be1e1e"} />
                        </View>
                        <Text style={[styles.text, { color: isDarkMode ? "#ccc" : "#333" }]}>
                            Criar Despesa
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

export default CreateTransaction

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)', // mesma ideia, mas mais explícito
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    modal: {
        borderRadius: 15,
        // marginTop: 450,
        backgroundColor: '#fff',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },

    background: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 16,
        paddingHorizontal: 30,
        borderRadius: 15,
    },
    buttonIcon: {
        borderWidth: 2,
        padding: 5,
        borderRadius: 25
    },
    text: {
        fontSize: 16,
        fontWeight: '500'
    }
})

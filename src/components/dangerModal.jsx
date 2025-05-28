import { StyleSheet, Text, View, Modal, Pressable, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { colorContext } from '@context/colorScheme';
import { useContext } from 'react'

const DangerModal = ({ open, setOpen, onPress, icon, title, text, confirmButton }) => {
    const { isDarkMode } = useContext(colorContext);

    return (
        <Modal
            transparent
            visible={open}
            animationType="fade"
            onRequestClose={() => setOpen(false)}
        >
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />

                <View style={[styles.modal, { backgroundColor: isDarkMode ? "#333" : "#e4e4e4" }]}>
                    <View style={{ backgroundColor: "#ce8888", padding: 12, borderRadius: 40, alignSelf: 'center', marginBottom: 8 }}>
                        <MaterialIcons name={icon || "warning"} size={40} color={isDarkMode ? "#8d1818" : "#be1e1e"} />
                    </View>

                    <Text style={{ fontSize: 24, marginVertical: 8, fontWeight: '500', textAlign: 'center', color: isDarkMode ? "#FFF" : "#333" }}>
                        {title || 'Você tem certeza?'}
                    </Text>

                    <Text style={{ lineHeight: 20, fontSize: 14, marginBottom: 24, fontWeight: '400', textAlign: 'center', color: isDarkMode ? "#d6d6d6" : "#333" }}>
                        {text || 'Essa ação não poderá ser desfeita.'}
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch' }}>
                        <TouchableOpacity
                            onPress={() => setOpen(false)}
                            style={{ padding: 8, paddingHorizontal: 16, backgroundColor: '#b8b6b6', borderRadius: 5 }}
                        >
                            <Text style={{ fontWeight: '600', fontSize: 16 }}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onPress}
                            style={{ padding: 8, paddingHorizontal: 16, backgroundColor: '#ca4c4c', borderRadius: 5 }}
                        >
                            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>
                                {confirmButton || 'Deletar'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}


export default DangerModal


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        padding: 30,
        paddingHorizontal: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    dropdown: {
        alignItems: 'center',
        maxWidth: '60%',
        padding: 20,
        gap: 10,
        borderRadius: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
})
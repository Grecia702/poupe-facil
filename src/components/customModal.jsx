import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native'
import { colorContext } from '@context/colorScheme';
import { useContext } from 'react'

const CustomModal = ({ visible, setVisible, children }) => {
    const { isDarkMode } = useContext(colorContext);
    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableOpacity style={styles.overlay} onPress={setVisible}>
                <View style={[styles.modal, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]}>
                    {children}
                </View>

            </TouchableOpacity>
        </Modal>
    )
}

export default CustomModal

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#00000086',
        justifyContent: 'center',
        padding: 20,
    },
    modal: {
        borderRadius: 10,
        padding: 20,
    },
})
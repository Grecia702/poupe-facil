import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native'
import { colorContext } from '@context/colorScheme';
import { useContext } from 'react'

const CustomModal = ({ visible, setVisible, children }) => {
    const { isDarkMode } = useContext(colorContext);
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.background} onPress={setVisible} />
                <View style={[styles.modal, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]}>
                    {children}
                </View>
            </View>
        </Modal>
    )
}

export default CustomModal

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#0a0a0a6c',
        justifyContent: 'center',
        padding: 20,
    },
    background: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    modal: {
        borderRadius: 10,
        padding: 10,
    },
})

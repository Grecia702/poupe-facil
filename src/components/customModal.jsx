import { StyleSheet, View, Modal } from 'react-native'
import { colorContext } from '@context/colorScheme';
import { useContext } from 'react'

const CustomModal = ({ visible, children }) => {
    const { isDarkMode } = useContext(colorContext);
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
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
        backgroundColor: '#00000066',
        justifyContent: 'center',
        padding: 20,
    },
    modal: {
        borderRadius: 10,
        padding: 20,
    },
})
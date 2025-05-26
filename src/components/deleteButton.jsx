import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomModal from './customModal';

const DeleteButton = ({ visible, setVisible, children }) => {
    return (
        <TouchableOpacity style={styles.delete} onPress={setVisible}>
            <MaterialIcons name="delete" size={24} color="white" />

            {children}

        </TouchableOpacity>
    )
}

export default DeleteButton

const styles = StyleSheet.create({
    delete: {
        alignSelf: 'center',
        padding: 10,
        elevation: 3,
        backgroundColor: '#CC5555',
        borderRadius: 5,
    },
})
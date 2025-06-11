import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { colorContext } from '@context/colorScheme';
import { useContext } from 'react'
import { useNavigation } from '@react-navigation/native';

const CreateItem = ({ text, buttonText, screen, icon, onPress }) => {
    const { isDarkMode } = useContext(colorContext)
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            {icon}
            <Text style={[styles.text, { color: isDarkMode ? '#DDD' : 'black', }]}>
                {text}
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => onPress ? onPress() : navigation.navigate(screen)}
            >
                <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CreateItem

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        gap: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24
    },
    text: {
        fontSize: 16
    },
    button: {
        backgroundColor: '#7842b6',
        borderRadius: 5,
        marginTop: 8,
        padding: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#DDD'
    },
})
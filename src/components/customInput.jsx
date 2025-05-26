import { StyleSheet, Text, View, TextInput, Touchable, TouchableOpacity } from 'react-native'
import { colorContext } from '@context/colorScheme';
import { useContext } from 'react'

const CustomInput = ({ description, placeholder, type, value, onChangeText, required, height, onPress }) => {
    const { isDarkMode } = useContext(colorContext);
    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: required ? '#c94444' : (isDarkMode ? '#ddd' : '#111') }]}>{description}</Text>
            <View style={[styles.input, { backgroundColor: isDarkMode ? '#222' : '#fff', borderColor: isDarkMode ? '#333' : '#ccc' }]}>

                {type === 'date' ? (
                    <TouchableOpacity onPress={onPress}>
                        <Text style={[styles.inputText, { color: isDarkMode ? '#a3a3a3' : "#575757" }]}>
                            {placeholder}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TextInput
                        keyboardType={type}
                        placeholder={placeholder}
                        style={[styles.inputText, { height: height || 'auto', color: isDarkMode ? '#DDD' : "#333", }]}
                        value={value}
                        maxLength={type === 'numeric-pad' ? 20 : undefined}
                        onChangeText={onChangeText}
                        placeholderTextColor={isDarkMode ? '#a3a3a3' : "#575757"}
                    />
                )}
            </View>
        </View>
    )
}

export default CustomInput

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 10,
        paddingVertical: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: '500'
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
    },
    inputText: {
        textAlignVertical: 'top',
        fontSize: 16,
        fontWeight: 400
    }
})
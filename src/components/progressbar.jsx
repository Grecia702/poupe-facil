import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Bar } from 'react-native-progress';
import CustomProgressBar from './customProgressBar';

const ProgressBar = ({ data, size, label, textColor, unfilledColor, value, event }) => {

    const colorProgress = () => {
        if (data > 0.9) return "#C62828"
        if (data > 0.6) return "#FFB300"
        return "teal"
    }


    return (
        <TouchableOpacity onPress={event} style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.text, { color: textColor }]}>{label}</Text>
                <Text style={[styles.text, { color: textColor }]}>{value}</Text>
            </View>
            <CustomProgressBar
                width={size}
                height={13}
                progress={data}
                borderRadius={10}
                color={colorProgress()}
                unfilledColor={unfilledColor}
            />
        </TouchableOpacity>
    )
}

export default ProgressBar

const styles = StyleSheet.create({
    container: {
        gap: 8,
        marginBottom: 16
    },
    text: {
        fontSize: 18,
        fontWeight: '600',
    }
})
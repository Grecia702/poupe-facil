import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface DropdownItemProps {
    onPress: () => void;
    isDarkMode: boolean;
    children: React.ReactNode;
}

export const DropdownItem = ({ onPress, isDarkMode, children }: DropdownItemProps) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.dropdownItem}>
            <Text style={[styles.dropdownText, { color: isDarkMode ? '#EEE' : '#222' }]}>
                {children}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    dropdownText: {
        fontSize: 16,
    },
});
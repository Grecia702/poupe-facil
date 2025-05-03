import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const sortOptions = [
    { label: 'Data (Mais recentes)', value: 'date_desc' },
    { label: 'Data (Mais antigos)', value: 'date_asc' },
    { label: 'Valor (Maior primeiro)', value: 'value_desc' },
    { label: 'Valor (Menor primeiro)', value: 'value_asc' },
];

const SortDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(sortOptions[0]);

    const toggleDropdown = () => setIsOpen(prev => !prev);
    const handleOptionSelect = (option) => {
        setSelected(option);
        setIsOpen(false);
        console.log('Ordenar por:', option.value); // aqui você aplicaria a lógica de ordenação real
    };
    const handleOutsidePress = () => setIsOpen(false);

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.overlay}>
                <View style={styles.dropdownWrapper}>
                    <TouchableOpacity onPress={toggleDropdown} style={styles.button}>
                        <Text style={styles.buttonText}>{selected.label} ▼</Text>
                    </TouchableOpacity>

                    {isOpen && (
                        <View style={styles.dropdown}>
                            {sortOptions.map((option, index) => (
                                <TouchableOpacity key={index} style={styles.item} onPress={() => handleOptionSelect(option)}>
                                    <Text>{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: 60,
    },
    dropdownWrapper: {
        position: 'relative',
        marginLeft: 20,
    },
    button: {
        padding: 10,
        backgroundColor: '#3498db',
        borderRadius: 5,
        alignItems: 'center',
        width: 200,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    dropdown: {
        marginTop: 5,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        width: 200,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});

export default SortDropdown;

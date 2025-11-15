import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable } from 'react-native'
import React, { useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const NavMonths = ({ isDarkMode, meses, open, setOpen }) => {
    const [yearModal, setYearModal] = useState(2025)
    const [selectedMonth, setSelectedMonth] = useState(null);
    return (
        <Modal
            transparent
            visible={open}
            animationType="fade"
            onRequestClose={() => setOpen(false)}
        >
            <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
                <View style={[styles.dropdown, { backgroundColor: isDarkMode ? '#333' : '#ffffff' }]}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => setYearModal(prev => prev - 1)}>
                            <MaterialIcons name="arrow-back-ios" size={24} color={isDarkMode ? "#CCC" : "#222"} />
                        </TouchableOpacity>
                        <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>{yearModal}</Text>
                        <TouchableOpacity onPress={() => setYearModal(prev => prev + 1)}>
                            <MaterialIcons name="arrow-forward-ios" size={24} color={isDarkMode ? "#CCC" : "#222"} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {meses.map((item, index) => {
                                const isSelected = selectedMonth === index;
                                return (
                                    <TouchableOpacity onPress={() => setSelectedMonth(index)}>
                                        <Text key={index}
                                            style={{
                                                padding: 5,
                                                backgroundColor: isSelected ? (isDarkMode ? '#1e40af' : '#6888bb')
                                                    : 'transparent',
                                                color: isSelected || isDarkMode ? '#e8e9ec'
                                                    : '#111111',
                                                fontWeight: isSelected ? '500' : '400',
                                                marginHorizontal: 4,
                                                borderRadius: 10
                                            }}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>

                    <View style={styles.buttonWrapper}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: '#949494' }]}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOpen(prev => !prev)} style={styles.button}>
                            <Text style={styles.buttonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}

export default NavMonths
const styles = StyleSheet.create({
    contentContainer: {
        minHeight: '100%',
        padding: 15,
        gap: 10,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        paddingHorizontal: 15,
        paddingTop: 30,
    },
    transactionCards: {
        padding: 15,
        elevation: 2
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        alignItems: 'center',
        maxWidth: '70%',
        padding: 20,
        gap: 10,
        borderRadius: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },

    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'stretch'
    },
    button: {
        height: 'auto',
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#4862da'
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '500'
    },
});

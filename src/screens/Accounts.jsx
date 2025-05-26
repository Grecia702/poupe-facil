import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, Pressable } from 'react-native';
import React, { useState, useContext, useMemo, useCallback } from 'react';
import Account from '@components/accounts';
import { useContasAuth } from '@context/contaContext';
import { colorContext } from '@context/colorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Separator } from '../components/accounts/styles';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';


const ModalData = ({ isDarkMode, meses, open, setOpen }) => {
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
                <View style={[styles.dropdown, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
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
                                                backgroundColor: isSelected ? (isDarkMode ? '#1e40af' : '#3b82f6')
                                                    : 'transparent',
                                                color: isSelected || isDarkMode ? '#e8e9ec'
                                                    : '#111111',
                                                fontWeight: isSelected ? '500' : '400',
                                                marginHorizontal: 4
                                            }}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>

                    <View style={styles.buttonWrapper}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: '#c74b4b' }]}>
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
};

const BankAccount = () => {
    const meses = [
        "Jan", "Fev", "Mar", "Abr",
        "Mai", "Jun", "Jul", "Ago",
        "Set", "Out", "Nov", "Dec",
    ]
    const navigation = useNavigation();
    const { dadosContas, refetch } = useContasAuth();
    const { isDarkMode } = useContext(colorContext);
    const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
    const [dropdownVisibleId, setDropdownVisibleId] = useState(null);
    const [open, setOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false)
    const currentMonth = meses[monthIndex];

    const HeaderComponent = () => {
        return (
            <View style={{ flexDirection: 'row', alignSelf: 'center', gap: 5 }}>
                <TouchableOpacity onPress={() => setMonthIndex(prev => (prev - 1 + 12) % 12)}>
                    <MaterialIcons name="arrow-back-ios" size={24} color={isDarkMode ? "#CCC" : "#222"} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setOpen(true)}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDarkMode ? "#CCC" : "#222" }}>
                        {currentMonth}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMonthIndex(prev => (prev + 1) % 12)}>
                    <MaterialIcons name="arrow-forward-ios" size={24} color={isDarkMode ? "#CCC" : "#222"} />
                </TouchableOpacity>
                <ModalData
                    isDarkMode={isDarkMode}
                    meses={meses}
                    open={open}
                    setOpen={setOpen}
                />
            </View>
        );
    };

    console.log(dadosContas)

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={dadosContas}
                keyExtractor={(item) => (item.id).toString()}
                contentContainerStyle={[styles.contentContainer, { backgroundColor: isDarkMode ? "#2e2e2e" : "#ffffffd5" }]}
                style={{ backgroundColor: isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E' }}
                ListHeaderComponent={HeaderComponent}
                showsVerticalScrollIndicator={true}
                refreshing={refreshing}
                onRefresh={refetch}
                renderItem={({ item }) => {
                    return (
                        <>
                            <Account
                                name={item.nome_conta}
                                value={item.saldo}
                                icon={item.icone}
                                color={isDarkMode ? "#222" : "#DDD"}
                                textColor={isDarkMode ? "#CCC" : "#222"}
                                id={item.id}
                                isVisible={dropdownVisibleId === item.id}
                                setVisibleId={setDropdownVisibleId}
                                setRefreshing={setRefreshing}
                            />
                            <Separator color={isDarkMode ? "#cccccc6f" : "#22222275"} />
                        </>
                    );
                }}
            />
            <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
                <MaterialIcons name="add-circle" size={64} color={"#3f74d8"}
                    style={{ position: 'absolute', bottom: 10, right: 10 }}
                />
            </TouchableOpacity>
        </View>
    );
};

export default BankAccount;

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
        maxWidth: '60%',
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
        backgroundColor: '#2b37e2'
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '500'
    },
});

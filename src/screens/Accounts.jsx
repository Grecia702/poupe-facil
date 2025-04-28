import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, Pressable } from 'react-native';
import React, { useState, useContext, useMemo, useCallback } from 'react';
import Account from '@components/accounts';
import { useContasAuth } from '@context/contaContext';
import { useTransactionAuth } from '@context/transactionsContext';
import TransactionCard from '@components/transactions'
import { colorContext } from '@context/colorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Separator } from '../components/accounts/styles';
import { format } from 'date-fns';


const BankAccount = () => {
    const meses = [
        "Jan", "Fev", "Mar", "Abr",
        "Mai", "Jun", "Jul", "Ago",
        "Set", "Out", "Nov", "Dec",
    ]
    const { dadosContas } = useContasAuth();
    const { dadosAPI } = useTransactionAuth();
    const { isDarkMode } = useContext(colorContext);
    const [month, setMonth] = useState(meses[2]);
    const [year, setYear] = useState(2025)
    const [yearModal, setYearModal] = useState(2025)
    const [visibleId, setVisibleId] = useState(null)
    const [aberto, setAberto] = useState(false);

    const contasMemo = useMemo(() => dadosContas, [dadosContas]);
    const transacoesMemo = useMemo(() => dadosAPI, [dadosAPI])

    const handleYearChange = useCallback((direction) => {
        setYear(prevYear => prevYear + direction);
    }, []);


    const ModalData = () => {
        return (
            <Modal
                transparent
                visible={aberto}
                animationType="fade"
                onRequestClose={() => setAberto(false)}
            >
                <Pressable style={styles.overlay} onPress={() => setAberto(false)}>
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

                        <View style={{ flexDirection: 'row' }}>
                            {meses.map((item, index) => (
                                <Text key={index} style={{ color: isDarkMode ? '#fff' : '#333' }}>{item} </Text>
                            ))}
                        </View>
                    </View>
                </Pressable>
            </Modal>
        );
    };

    const HeaderComponent = () => {
        return (
            <View style={{ flexDirection: 'row', alignSelf: 'center', gap: 5 }}>
                <TouchableOpacity onPress={() => setMonth(prev => prev - 1)}>
                    <MaterialIcons name="arrow-back-ios" size={24} color={isDarkMode ? "#CCC" : "#222"} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setAberto(true)}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDarkMode ? "#CCC" : "#222" }}>
                        {month}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMonth(prev => prev + 1)}>
                    <MaterialIcons name="arrow-forward-ios" size={24} color={isDarkMode ? "#CCC" : "#222"} />
                </TouchableOpacity>
                <ModalData />
            </View>
        );
    };
    return (
        <>
            <FlatList
                data={contasMemo}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[styles.contentContainer, { backgroundColor: isDarkMode ? "#2e2e2e" : "#ffffffd5" }]}
                style={{ backgroundColor: isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E' }}
                ListHeaderComponent={HeaderComponent}
                renderItem={({ item }) => {
                    const isExpanded = visibleId === item.id;
                    const conta_id = item.id
                    return (
                        <>
                            <Account
                                name={item.nome_conta}
                                value={item.saldo}
                                color={isDarkMode ? "#DDD" : "#ddd"}
                                textColor={isDarkMode ? "#DDD" : "#222"}
                                id={item.id}
                                onPress={setVisibleId}
                            />
                            <Separator color={isDarkMode ? "#cccccc6f" : "#22222275"} />
                            {isExpanded && (
                                transacoesMemo
                                    ?.filter(item => item.account_id === conta_id)
                                    .map(item => {
                                        return (
                                            <View key={item.transaction_id} style={[styles.transactionCards]}>
                                                <TransactionCard
                                                    iconName={item.categoria}
                                                    color={item.tipo === "Despesa" ? '#dd6161' : '#2563EB'}
                                                    state={isDarkMode}
                                                    category={item.categoria}
                                                    date={format(item.data_transacao, "dd/MM/yyyy")}
                                                    value={item.valor}
                                                    onPress={() => console.log("hello")}
                                                    id={item.transaction_id}
                                                />
                                            </View>
                                        )
                                    })
                            )}
                        </>
                    );
                }}
            />

        </>
    );
};

export default BankAccount;

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 15,
        gap: 15,
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
        backgroundColor: 'rgba(0,0,0,0.5)', // overlay meio escuro
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        elevation: 10, // sombra no Android
        shadowColor: '#000', // sombra no iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,

    },
});

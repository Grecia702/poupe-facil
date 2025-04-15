import { StyleSheet, FlatList, TouchableOpacity, Modal, Text } from 'react-native'
import React, { useState, useContext } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { TransactionContext } from '@context/transactionsContext';
import { colorContext } from '@context/colorScheme'
import TransactionCard from '@components/transactions';
import { StyledScroll } from '@components/widget/styles';
import ModalView from '@components/modal';
import moment from 'moment';

const Transactions = ({ limit }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { isDarkMode } = useContext(colorContext);
    const { dados, checkDados } = useContext(TransactionContext);

    const renderItem = ({ item }) => {
        const formattedDate = moment(item.data_compra).format('DD/MM/YYYY')
        if (item.tipo === "Despesa") {
            return (
                <StyledScroll>
                    <TransactionCard iconName="directions-car" color={'#dd6161'} state={isDarkMode} category={item.categoria} date={formattedDate} value={item.valor} />
                </StyledScroll>

            );
        } else {

            return (
                <StyledScroll>
                    <TransactionCard iconName="directions-car" color={'#2563EB'} state={isDarkMode} category={item.categoria} date={formattedDate} value={item.valor} />
                </StyledScroll>

            );
        }
    };

    const ModalTransactions = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <ModalView onPress={() => setModalVisible(false)}>
                </ModalView>
            </Modal>

        );
    }
    return (
        <FlatList
            contentContainerStyle={[styles.Container, { backgroundColor: isDarkMode ? "#2e2e2e" : "#ffffffd5" }]}
            ListHeaderComponent={
                <>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 20 }}>
                        <ModalTransactions />
                        <MaterialIcons name="filter-alt" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => checkDados()} style={{ backgroundColor: 'blue', alignSelf: 'flex-end' }} >
                        <Text>Resetar Filtros!</Text>
                    </TouchableOpacity>
                </>
            }
            data={dados.slice(0, limit)}
            keyExtractor={(item) => item.transaction_id}
            renderItem={renderItem}
            style={{ backgroundColor: isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E' }}

        />
    );
}

export default Transactions

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        paddingRight: 20,
        paddingTop: 40,
        flexDirection: 'column',
    }
})
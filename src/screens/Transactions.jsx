import { StyleSheet, Text, View, FlatList, Platform, TouchableOpacity, Modal } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { colorContext } from '../../context/colorScheme'
import Cookies from 'js-cookie';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment'
import TransactionCard from '../components/transactions';
import { API_URL } from '@env'
import { StyledScroll } from '../components/widget/styles';
import { MaterialIcons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-web';
import ModalView from '../components/modal';

const Transactions = ({ limit }) => {
    const [dados, setDados] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const { isDarkMode } = useContext(colorContext);

    const checkDados = async () => {

        if (Platform.OS === 'web') {
            const token = Cookies.get('jwtToken');

            if (!token) {
                console.log("Token não encontrado.");
                return;
            }
        } else if (Platform.OS === 'android') {

            const token = await SecureStore.getItemAsync('jwtToken');
            if (!token) {
                console.log("Token mobile não encontrado.");
                return;
            }
        }

        try {
            const response = await axios.get(`${API_URL}/profile/transaction/list`, {
                withCredentials: true
            });

            if (response.status === 200) {
                setDados(response.data);
            }
        }
        catch (error) {
            console.log("Erro ao fazer requisição:", error);
        }
    }

    useEffect(() => {
        checkDados();
    }, []);

    // const response = await axios.get(`${API_URL}/profile/transaction/list`)
    // console.log(response.data)
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
                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ alignSelf: 'flex-end' }}>
                    <ModalTransactions />
                    {/* <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(121, 115, 115, 0.5)' }}>
                            <View style={{ width: 300, height: 200, backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
                                <Text style={{ fontSize: 20, marginBottom: 20 }}>Este é um Modal!</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text style={{ color: 'blue', fontSize: 18 }}>Fechar Modal</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal> */}
                    <MaterialIcons name="filter-alt" size={24} color="black" />
                </TouchableOpacity>
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
        // gap: 10,
    }


})
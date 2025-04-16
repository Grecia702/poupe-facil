import { StyleSheet, FlatList, TouchableOpacity, Modal, Text, View } from 'react-native'
import React, { useState, useContext, useEffect, useMemo } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { TransactionContext } from '@context/transactionsContext';
import { colorContext } from '@context/colorScheme'
import TransactionCard from '@components/transactions';
import { StyledScroll } from '@components/widget/styles';
import ModalView from '@components/modal';
import moment from 'moment';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { useWindowDimensions } from 'react-native';

const Transactions = ({ limit }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { dados, checkDados } = useContext(TransactionContext);
    const { isDarkMode } = useContext(colorContext);

    const limitedData = useMemo(() => {
        return dados.slice(0, limit);
    }, [dados, limit]);

    const { height, width } = useWindowDimensions();

    const loadData = async () => {
        setIsLoading(true);
        await checkDados();
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };
    useEffect(() => {
        loadData();
    }, []);

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

    const rectHeight = 30;
    const rectWidth = 100;
    const radius = 18;

    const priceWidth = 70;
    return (
        <>
            {refreshing || isLoading ? (
                <View style={{ flex: 1, backgroundColor: isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E' }}>
                    <View style={[styles.Container, { backgroundColor: isDarkMode ? "#2e2e2e" : "#ffffffd5" }]}>
                        <View style={{ position: 'relative', width: '100%', height: height }}>

                            <TouchableOpacity onPress={() => loadData()} style={{ backgroundColor: '#3B82F6', alignSelf: 'flex-start', position: 'absolute', padding: 10, borderRadius: 5, marginTop: 5 }} >
                                <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>Resetar Filtros!</Text>
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', padding: 10, gap: 10, alignSelf: 'flex-end', position: 'absolute', }}>

                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <ModalTransactions />
                                    <MaterialIcons name="filter-alt" size={24} color="black" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <ModalTransactions />
                                    <MaterialIcons name="sort" size={24} color="black" />
                                </TouchableOpacity>
                            </View >
                            <View style={{ position: 'relative', width: '100%', height: height, pointerEvents: 'none' }}>
                                <ContentLoader
                                    speed={1.2}
                                    width={width}
                                    height={height}
                                    viewBox={`0 0 ${width} ${height}`}
                                    backgroundColor={isDarkMode ? "#333" : "#bcecc0"}
                                    foregroundColor={isDarkMode ? "#444" : "#a9dbad"}
                                >
                                    <Rect x="60" y="65" rx="5" ry="5" width={rectWidth} height={rectHeight} />
                                    <Rect x="60" y="120" rx="5" ry="5" width={rectWidth} height={rectHeight} />
                                    <Rect x="60" y="175" rx="5" ry="5" width={rectWidth} height={rectHeight} />
                                    <Rect x="60" y="230" rx="5" ry="5" width={rectWidth} height={rectHeight} />
                                    <Rect x="60" y="285" rx="5" ry="5" width={rectWidth} height={rectHeight} />
                                    <Rect x="60" y="340" rx="5" ry="5" width={rectWidth} height={rectHeight} />
                                    <Rect x="60" y="395" rx="5" ry="5" width={rectWidth} height={rectHeight} />
                                    <Rect x="60" y="450" rx="5" ry="5" width={rectWidth} height={rectHeight} />
                                    <Rect x="60" y="505" rx="5" ry="5" width={rectWidth} height={rectHeight} />
                                    <Rect x="60" y="560" rx="5" ry="5" width={rectWidth} height={rectHeight} />

                                    <Rect x={width - 100} y="65" rx="5" ry="5" width={priceWidth} height={rectHeight} />
                                    <Rect x={width - 100} y="120" rx="5" ry="5" width={priceWidth} height={rectHeight} />
                                    <Rect x={width - 100} y="175" rx="5" ry="5" width={priceWidth} height={rectHeight} />
                                    <Rect x={width - 100} y="230" rx="5" ry="5" width={priceWidth} height={rectHeight} />
                                    <Rect x={width - 100} y="285" rx="5" ry="5" width={priceWidth} height={rectHeight} />
                                    <Rect x={width - 100} y="340" rx="5" ry="5" width={priceWidth} height={rectHeight} />
                                    <Rect x={width - 100} y="395" rx="5" ry="5" width={priceWidth} height={rectHeight} />
                                    <Rect x={width - 100} y="450" rx="5" ry="5" width={priceWidth} height={rectHeight} />
                                    <Rect x={width - 100} y="505" rx="5" ry="5" width={priceWidth} height={rectHeight} />
                                    <Rect x={width - 100} y="560" rx="5" ry="5" width={priceWidth} height={rectHeight} />


                                    <Circle cx="20" cy="80" r={radius} />
                                    <Circle cx="20" cy="135" r={radius} />
                                    <Circle cx="20" cy="190" r={radius} />
                                    <Circle cx="20" cy="245" r={radius} />
                                    <Circle cx="20" cy="300" r={radius} />
                                    <Circle cx="20" cy="355" r={radius} />
                                    <Circle cx="20" cy="410" r={radius} />
                                    <Circle cx="20" cy="465" r={radius} />
                                    <Circle cx="20" cy="520" r={radius} />
                                    <Circle cx="20" cy="575" r={radius} />
                                </ContentLoader>
                            </View>
                        </View>
                    </View>
                </View>
            ) : (

                <FlatList
                    contentContainerStyle={[styles.Container, { backgroundColor: isDarkMode ? "#2e2e2e" : "#ffffffd5" }]}
                    data={limitedData}
                    keyExtractor={(item) => item.transaction_id}
                    renderItem={renderItem}
                    refreshing={refreshing}
                    onRefresh={loadData}
                    style={{ backgroundColor: isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E' }}
                    ListHeaderComponent={
                        <View style={styles.ListHeader}>

                            <TouchableOpacity onPress={() => loadData()} style={{ backgroundColor: '#3B82F6', alignSelf: 'flex-end', padding: 10, borderRadius: 5 }} >
                                <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>Resetar Filtros!</Text>
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', padding: 10, gap: 10, alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 20 }}>
                                    <ModalTransactions />
                                    <MaterialIcons name="filter-alt" size={24} color="black" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 20 }}>
                                    <ModalTransactions />
                                    <MaterialIcons name="sort" size={24} color="black" />
                                </TouchableOpacity>
                            </View>

                        </View>
                    }

                />)}
        </>
    );
}

export default Transactions

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        paddingHorizontal: 15,
        paddingTop: 50,
        flexDirection: 'column',
    },
    ListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    }
})
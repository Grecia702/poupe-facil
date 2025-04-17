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

    const [filtrosAtivos, setFiltrosAtivos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { dados, checkDados } = useContext(TransactionContext);
    const { isDarkMode } = useContext(colorContext);
    const { height, width } = useWindowDimensions();

    // console.log("dados filtrados:", dados)

    const rectHeight = 30;
    const rectWidth = 100;
    const radius = 18;
    const priceWidth = 70;

    // const limitedData = useMemo(() => {
    //     return dados.slice(0, limit);
    // }, [dados, limit]);

    const loadData = async () => {
        setIsLoading(true);
        await checkDados();
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
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

    console.log(filtrosAtivos)
    const removeItem = (id) => {
        const novaLista = filtrosAtivos.filter((_, index) => index !== id);
        setFiltrosAtivos(novaLista);
    }

    // function makeFilter(filtros) {
    //     const valorNumber = valor !== '' ? parseFloat(valor) : null;
    //     const filtragem = dados.filter(item => {
    //         const itemValor = parseFloat(item.valor);
    //         let matchValor;
    //         if (valorNumber === null) {
    //             matchValor = true;
    //         } else if (operator === 'Lesser') {
    //             matchValor = itemValor < valorNumber;
    //         } else {
    //             matchValor = itemValor > valorNumber;
    //         }
    //         const matchDate = date === '' || item.data_compra.startsWith(date);
    //         const matchCategoria = categorias.length === 0 || categorias.includes(item.categoria);
    //         return matchValor && matchDate && matchCategoria;
    //     });
    //     setDados(filtragem)
    // }
    const ModalTransactions = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <ModalView onPress={() => setModalVisible(false)}
                    setFiltrosAtivos={setFiltrosAtivos}
                // applyFilters={makeFilter}
                >
                </ModalView>
            </Modal>

        );
    }

    return (
        <>
            {refreshing || isLoading ? (
                <View style={{ flex: 1, backgroundColor: isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E' }}>
                    <View style={[styles.Container, { backgroundColor: isDarkMode ? "#2e2e2e" : "#ffffffd5" }]}>
                        <View style={{ position: 'relative', width: '100%', height: height }}>
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
                    data={dados}
                    keyExtractor={(item) => item.transaction_id}
                    renderItem={renderItem}
                    refreshing={refreshing}
                    onRefresh={loadData}
                    style={{ backgroundColor: isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E' }}
                    ListHeaderComponent={
                        <View style={[styles.ListHeader]}>

                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', backgroundColor: "#00ff88aa", gap: 5 }}>
                                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ flexDirection: 'row', backgroundColor: "#ff00ffaa" }}>
                                    <ModalTransactions />
                                    <MaterialIcons name="filter-alt" size={24} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ flexDirection: 'row', backgroundColor: "#ff00ffaa" }}>
                                    <ModalTransactions />
                                    <MaterialIcons name="sort" size={24} color="black" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => upCount()} style={{ flexDirection: 'row', backgroundColor: "#ff00ffaa" }}>
                                    <ModalTransactions />
                                    <MaterialIcons name="add" size={24} color="red" />
                                </TouchableOpacity>

                                <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: "#ff00ffaa", padding: 10 }}>
                                    <Text style={{ fontSize: 20 }}>{count}</Text>
                                </TouchableOpacity>
                            </View>

                            {
                                filtrosAtivos.length > 0 ?
                                    <>
                                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                                            <Text style={{ fontSize: 16, alignSelf: 'flex-end', fontWeight: 'bold', color: isDarkMode ? "#EEE" : '#08380e' }}>Filtros Ativos: </Text>
                                            {filtrosAtivos.map((item, index) =>
                                                <TouchableOpacity key={index} style={{ backgroundColor: "#508bc5", padding: 5, }} onPress={() => removeItem(index)}>
                                                    <Text style={{ color: "white", fontSize: 14 }}>{item}</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>

                                        <TouchableOpacity onPress={() => { setFiltrosAtivos([]); loadData() }} style={{ backgroundColor: '#c44343', alignSelf: 'flex-start', padding: 10, borderRadius: 5 }} >
                                            <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>Resetar Filtros!</Text>
                                        </TouchableOpacity>
                                    </>
                                    : null
                            }

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
        paddingTop: 30,
    },
    ListHeader: {
        flexDirection: 'column',
        gap: 15,
        marginBottom: 10,
    }
})
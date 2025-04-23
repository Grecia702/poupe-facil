import { StyleSheet, FlatList, TouchableOpacity, Modal, Text, View, Pressable } from 'react-native'
import React, { useState, useContext, useEffect, useMemo } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { colorContext } from '@context/colorScheme'
import TransactionCard from '@components/transactions';
import ModalView from '@components/modal';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { useWindowDimensions } from 'react-native';
import { useTransactionAuth } from '@context/transactionsContext';

// TODO: rotas de criação/edição/exclusão de transações, implementar função de SORT, refatorar e otimizar
const Transactions = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { dadosAPI, refetch } = useTransactionAuth();
    const [dropdownVisibleId, setDropdownVisibleId] = useState(null);
    const [dadosFiltrados, setDadosFiltrados] = useState([]);
    const { isDarkMode } = useContext(colorContext);
    const [filtrosChips, setFiltrosChips] = useState([]);
    const [filtrosCategorias, setFiltrosCategorias] = useState({
        categorias: [],
        valor: null,
        operador: null,
        data: null
    })

    const { height, width } = useWindowDimensions();
    const rectHeight = 30;
    const rectWidth = 100;
    const radius = 18;
    const priceWidth = 70;


    const loadData = async () => {
        setRefreshing(true);
        refetch();
        setFiltrosCategorias({
            categorias: [],
            valor: null,
            operador: null,
            data: null
        });
        setDadosFiltrados(dadosAPI);
        setFiltrosChips([])
        setTimeout(() => {
            setRefreshing(false);
        }, 500);

    };

    const renderItem = ({ item }) => {
        const formattedDate = moment(item.data_compra).format('DD/MM/YYYY')
        if (item.tipo === "Despesa") {
            return (
                <View style={{ position: 'relative', paddingVertical: 10 }}>
                    <TransactionCard iconName="directions-car" color={'#dd6161'}
                        state={isDarkMode} category={item.categoria} date={formattedDate}
                        value={item.valor} onPress={() => console.log("hello")}
                        id={item.transaction_id}
                        isVisible={dropdownVisibleId === item.transaction_id}
                        setVisibleId={setDropdownVisibleId} />

                </View>
            );
        } else {
            return (
                <View style={{ position: 'relative', paddingVertical: 10 }}>
                    <TransactionCard iconName="directions-car" color={'#2563EB'} state={isDarkMode}
                        category={item.categoria} date={formattedDate} value={item.valor} onPress={() => console.log("hello")}
                        id={item.transaction_id}
                        isVisible={dropdownVisibleId === item.transaction_id}
                        setVisibleId={setDropdownVisibleId} />
                </View>
            );
        }
    };

    useEffect(() => {
        const aplicarFiltrosAtivos = () => {
            const retorno = Object.entries(filtrosCategorias)
                .map(([key, value]) => {
                    if (Array.isArray(value) && value.length > 0) {
                        return value.map(item => item);
                    } else if (value !== null) {
                        return value;
                    }
                    return [];
                })
                .flat();
            setFiltrosChips(retorno);
            filterDadosApi(filtrosCategorias)
        };
        aplicarFiltrosAtivos();
    }, [filtrosCategorias])

    const filterDadosApi = (filtrosCategorias) => {
        const { valor, data, categorias, operador } = filtrosCategorias;
        const valorNumber = valor !== '' ? parseFloat(valor) : null;
        const filtragem = dadosAPI.filter(item => {
            const itemValor = parseFloat(item.valor);
            let matchValor = true;
            if (valorNumber !== null) {
                if (operador === 'Lesser') {
                    matchValor = itemValor < valorNumber;
                } else if (operador === 'Greater') {
                    matchValor = itemValor > valorNumber;
                }
            }
            const matchDate = !data || item.data_compra.startsWith(data);
            const matchCategoria = categorias.length === 0 || categorias.includes(item.categoria);
            return matchValor && matchDate && matchCategoria;
        });
        setDadosFiltrados(filtragem);
    }

    const removeFiltro = (categoria) => {
        const notArray = Object.keys(filtrosCategorias).find(item => filtrosCategorias[item] === categoria);
        const novosChips = filtrosChips.filter(item => item !== categoria);
        const novoFiltroCategoria = { ...filtrosCategorias };

        if (notArray) {
            novoFiltroCategoria[notArray] = null;
        } else {
            novoFiltroCategoria.categorias = filtrosCategorias.categorias?.filter(item => item !== categoria);
        }
        setFiltrosChips(novosChips);
        setFiltrosCategorias(novoFiltroCategoria);
        filterDadosApi(novoFiltroCategoria);
    };


    const ModalTransactions = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <ModalView setModalVisible={setModalVisible}
                    setFiltrosAtivos={setFiltrosChips}
                    setTesteFiltros={setFiltrosCategorias}
                />
            </Modal>
        );
    }
    return (
        <>
            {refreshing ? (
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
                <Pressable onPress={() => setDropdownVisibleId(null)} style={{ flex: 1 }}
                    pointerEvents="auto"
                >
                    <FlatList
                        contentContainerStyle={[styles.Container, { backgroundColor: isDarkMode ? "#2e2e2e" : "#ffffffd5" }]}
                        data={dadosFiltrados}
                        keyExtractor={(item) => item.transaction_id}
                        renderItem={renderItem}
                        refreshing={refreshing}
                        onRefresh={loadData}
                        style={{ backgroundColor: isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E' }}
                        ListHeaderComponent={
                            <>
                                <View style={[styles.ListHeader, { position: 'relative' }]}>
                                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end', gap: 5 }}>
                                        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ flexDirection: 'row', padding: 5, borderColor: isDarkMode ? "#DDD" : "#111", borderWidth: 2, borderRadius: 5 }}>
                                            <MaterialIcons name="filter-alt" size={24} color={isDarkMode ? "#DDD" : "#111"} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => console.log("sort")} style={{ flexDirection: 'row', padding: 5, borderColor: isDarkMode ? "#DDD" : "#111", borderWidth: 2, borderRadius: 5 }}>
                                            <MaterialIcons name="sort" size={24} color={isDarkMode ? "#DDD" : "#111"} />
                                        </TouchableOpacity>
                                    </View>
                                    {
                                        filtrosChips.length > 0 ?
                                            <>
                                                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                                                    <Text style={{ fontSize: 16, alignSelf: 'flex-end', fontWeight: 'bold', color: isDarkMode ? "#EEE" : '#08380e' }}>Filtros Ativos: </Text>
                                                    {filtrosChips.map((item, index) =>
                                                        <TouchableOpacity key={index} style={{ backgroundColor: "#508bc5", padding: 5, }} onPress={() => removeFiltro(item)}>
                                                            <Text style={{ color: "white", fontSize: 14 }}>{item}</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                                <TouchableOpacity onPress={() => { setFiltrosChips([]); loadData() }} style={{ backgroundColor: '#c44343', alignSelf: 'flex-start', padding: 10, borderRadius: 5 }} >
                                                    <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>Resetar Filtros!</Text>
                                                </TouchableOpacity>

                                            </>
                                            : null
                                    }
                                </View>
                                <ModalTransactions />
                            </>
                        }
                    />
                    <TouchableOpacity onPress={() => navigation.navigate('CreateTransaction')}>
                        <MaterialIcons name="add-circle" size={64} color={"#1b90df"}
                            style={{ position: 'absolute', bottom: 10, right: 10 }}
                        />
                    </TouchableOpacity>
                </Pressable>
            )}
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
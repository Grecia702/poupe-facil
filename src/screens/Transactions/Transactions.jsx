import { StyleSheet, FlatList, TouchableOpacity, Modal, Text, View, Pressable, ActivityIndicator, useWindowDimensions } from 'react-native'
import { useState, useContext, useMemo, useLayoutEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { colorContext } from '@context/colorScheme'
import TransactionCard from '@components/transactions';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { usePosts } from '@hooks/usePosts';
import { useQueryClient } from '@tanstack/react-query';

// TODO:  refatorar e otimizar
const Transactions = () => {
    const route = useRoute();
    const { params } = route.params || '';
    const tipo = params
    console.log('tipo: ', tipo)
    const [filters, setFilters] = useState({ tipo: tipo, orderBy: 'transaction_id', orderDirection: 'DESC' })
    const { data, refetch, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = usePosts({
        tipo: filters.tipo,
        orderBy: filters.orderBy,
        orderDirection: filters.orderDirection,
    });
    const { height, width } = useWindowDimensions();
    const queryClient = useQueryClient();
    const navigation = useNavigation();
    const onRefresh = async () => {
        await queryClient.resetQueries(['posts', {
            tipo: tipo,
            // natureza: 'variavel',
            orderBy: 'transaction_id',
            orderDirection: 'DESC',
        }]);
        await refetch();
    };

    const sortOptions = [
        { label: 'Data (Mais recentes)', value: 'date_desc' },
        { label: 'Data (Mais antigos)', value: 'date_asc' },
        { label: 'Valor (Maior primeiro)', value: 'value_desc' },
        { label: 'Valor (Menor primeiro)', value: 'value_asc' },
    ];
    const [refreshing, setRefreshing] = useState(false);
    const [dropdownVisibleId, setDropdownVisibleId] = useState(null);
    const [selected, setSelected] = useState(sortOptions[0]);
    const [isOpen, setIsOpen] = useState(false);
    const { isDarkMode } = useContext(colorContext);
    const [filtrosChips, setFiltrosChips] = useState([]);
    const allData = useMemo(() => data?.pages?.flatMap(page => page.data) || [], [data]);
    const toggleDropdown = () => setIsOpen(prev => !prev);
    const rectHeight = 30;
    const rectWidth = 100;
    const radius = 18;
    const priceWidth = 70;


    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };
    console.log('IDs das transações:', allData.map(item => item.transaction_id));
    useLayoutEffect(() => {
        let title;

        switch (tipo) {
            case 'despesa':
                title = 'Despesa Detalhada';
                break;
            case 'receita':
                title = 'Receita Detalhada';
                break;
            case 'investimento':
                title = 'Investimento';
                break;
            case 'cartao':
                title = 'Cartão de Crédito';
                break;
            default:
                title = 'Detalhes';
        }

        navigation.setOptions({
            title,
            headerStyle: {
                backgroundColor: isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E',
            },
            headerTintColor: isDarkMode ? 'white' : 'black',
        });
    }, [navigation, tipo, isDarkMode]);



    if (isLoading) {
        return (
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
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text>Erro ao carregar transações: {error.message}</Text>
            </View>
        );
    }

    if (!allData?.length) {
        return (
            <View style={styles.centerContainer}>
                <Text>Nenhuma transação encontrada</Text>
            </View>
        );
    }


    const loadData = async () => {
        try {
            console.log('teste')
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    };


    const orderTransactions = (order) => {
        setSelected(order);
        setIsOpen(false);
        switch (order.value) {
            case "date_asc":
                setFilters(item => ({ ...item, orderBy: 'data_transacao', orderDirection: 'ASC' }))
                break;
            case "date_desc":
                setFilters(item => ({ ...item, orderBy: 'data_transacao', orderDirection: 'DESC' }))
                break;
            case "value_asc":
                setFilters(item => ({ ...item, orderBy: 'valor', orderDirection: 'ASC' }))
                break;
            case "value_desc":
                setFilters(item => ({ ...item, orderBy: 'valor', orderDirection: 'DESC' }))
                break;
        }
    }

    // const ModalTransactions = () => {
    //     return (
    //         <Modal
    //             animationType="slide"
    //             transparent={true}
    //             visible={modalVisible}
    //             onRequestClose={() => setModalVisible(false)}
    //         >
    //             <ModalView setModalVisible={setModalVisible}
    //                 setFiltrosAtivos={setFiltrosChips}
    //                 setTesteFiltros={setFiltrosCategorias}
    //             />
    //         </Modal>
    //     );
    // }

    const renderItem = ({ item }) => {
        return (
            <TransactionCard
                iconName={item?.categoria}
                color={item?.tipo === "despesa" ? '#dd6161' : '#2563EB'}
                state={isDarkMode}
                loadData={loadData}
                category={item?.categoria}
                date={item?.data_transacao}
                value={item?.valor}
                recurrence={item?.recorrente}
                type={item?.natureza}
                id={item?.transaction_id}
                isVisible={dropdownVisibleId === item?.transaction_id}
                setVisibleId={setDropdownVisibleId} />
        );
    };
    return (
        <>
            <>
                {isOpen && (
                    <View style={[styles.dropdown, { backgroundColor: isDarkMode ? '#333' : '#fff', }]}>
                        {sortOptions.map((option, index) => (
                            <TouchableOpacity key={index} style={styles.item} onPress={() => orderTransactions(option)}>
                                <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                <FlatList
                    contentContainerStyle={[styles.Container, { backgroundColor: isDarkMode ? "#2e2e2e" : "#ffffffd5" }]}
                    data={allData}
                    keyExtractor={(item) => item.transaction_id.toString()}
                    renderItem={renderItem}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.8}
                    initialNumToRender={15}
                    windowSize={5}
                    maxToRenderPerBatch={10}
                    updateCellsBatchingPeriod={60}
                    ListFooterComponent={() => (
                        isFetchingNextPage ? (
                            <View>
                                <ActivityIndicator size="large" color={isDarkMode ? "#BBB" : "#122577"} />
                            </View>
                        ) : null
                    )}
                    style={{ backgroundColor: isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E' }}
                    ListHeaderComponent={
                        <>
                            <View style={[styles.ListHeader, { position: 'relative' }]}>
                                <View style={styles.dropdownWrapper}>
                                    <TouchableOpacity style={
                                        [styles.optionsButton, { borderColor: isDarkMode ? "#DDD" : "#111", }]
                                    }>
                                        <MaterialIcons name="filter-alt" size={24} color={isDarkMode ? "#DDD" : "#111"} />
                                        <Text style={{ fontWeight: 500, color: isDarkMode ? "#DDD" : "#111" }}>Filtrar por</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPressIn={toggleDropdown} style={
                                        [styles.optionsButton, { borderColor: isDarkMode ? "#DDD" : "#111", }]
                                    }>
                                        <MaterialIcons name="sort" size={24} color={isDarkMode ? "#DDD" : "#111"} />
                                        <Text style={{ fontWeight: 500, color: isDarkMode ? "#DDD" : "#111" }}>Ordenar por</Text>
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

                        </>
                    }
                />
                <TouchableOpacity onPress={() => navigation.navigate('CreateTransaction')}>
                    <MaterialIcons name="add-circle" size={64} color={"#1b90df"}
                        style={{ position: 'absolute', bottom: 10, right: 10 }}
                    />
                </TouchableOpacity>
            </>

        </>

    );
}

export default Transactions

const styles = StyleSheet.create({
    Container: {
        // flex: 1,
        minHeight: '100%',
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        paddingHorizontal: 15,
        paddingTop: 30,
        position: 'relative'

    },
    ListHeader: {
        flexDirection: 'column',
        gap: 15,
        marginBottom: 10,
        position: 'relative'
    },
    dropdownWrapper: {
        marginLeft: 20,
        flexDirection: 'row',
        alignSelf: 'flex-end',
        gap: 5,
    },
    dropdown: {
        position: 'absolute',
        top: 70,
        right: 20,
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        elevation: 5,
        width: 200,
        zIndex: 1,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionsButton: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 5,
        gap: 5,
        borderWidth: 2,
        borderRadius: 5
    }
})
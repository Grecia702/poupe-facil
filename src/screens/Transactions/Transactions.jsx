import { StyleSheet, FlatList, TouchableOpacity, Modal, Text, View, Pressable, ActivityIndicator, useWindowDimensions } from 'react-native'
import { useState, useContext, useMemo, useLayoutEffect, useCallback } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { colorContext } from '@context/colorScheme'
import TransactionCard from '@components/transactions';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { useTransactionAuth } from '@context/transactionsContext';
import CustomLoader from '@components/contentLoader'
import CreateTransaction from '@components/createTransaction'

// TODO:  refatorar e otimizar
const Transactions = () => {
    const route = useRoute();
    const { params } = route.params || '';
    const tipo = params;
    const { height, width } = useWindowDimensions();
    const [filters, setFilters] = useState({ tipo: tipo, orderBy: 'transaction_id', orderDirection: 'DESC' })
    const { useFilteredTransacoes } = useTransactionAuth();
    const serializedFilters = `${filters.tipo}-${filters.orderBy}-${filters.orderDirection}`;
    const { data, refetch, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useFilteredTransacoes(serializedFilters, filters);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
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
    const navigation = useNavigation();
    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                refetch(),
                new Promise(resolve => setTimeout(resolve, 500))
            ]);
        } catch (err) {
            console.error("Erro ao atualizar transações:", err);
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            onRefresh();
        }, [serializedFilters, filters])
    );

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
                title = 'Transações';
        }

        navigation.setOptions({
            title,
            headerStyle: {
                backgroundColor: isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E',
            },
            headerTintColor: isDarkMode ? 'white' : 'black',
        });
    }, [navigation, tipo, isDarkMode]);

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text>Erro ao carregar transações: {error.message}</Text>
            </View>
        );
    }

    if (isLoading || refreshing) {
        return (
            <CustomLoader
                width={width}
                height={height}
                rectHeight={30}
                rectWidth={150}
                radius={25}
                priceWidth={70}
            />
        );
    }

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

    const renderItem = ({ item }) => {
        return (
            <TransactionCard
                iconName={item?.categoria}
                color={item?.tipo === "despesa" ? '#dd6161' : '#2563EB'}
                state={isDarkMode}
                name_transaction={item?.nome_transacao}
                conta={item?.conta}
                category={item?.categoria}
                date={item?.data_transacao}
                value={item?.valor}
                recurrence={item?.recorrente}
                type={item?.natureza}
                id={item?.transaction_id}
                isVisible={dropdownVisibleId === item?.transaction_id}
                setVisibleId={setDropdownVisibleId}
                onRefresh={onRefresh}
            />

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
                                    </TouchableOpacity>
                                    <TouchableOpacity onPressIn={toggleDropdown} style={
                                        [styles.optionsButton, { borderColor: isDarkMode ? "#DDD" : "#111", }]
                                    }>
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
                        </>
                    }
                />
                <TouchableOpacity onPress={() => setShowTransactionModal(true)}>
                    <MaterialIcons name="add-circle" size={64} color={"#1b90df"}
                        style={{ position: 'absolute', bottom: 10, right: 10 }}
                    />
                </TouchableOpacity>
                <CreateTransaction
                    isOpen={showTransactionModal}
                    setIsOpen={() => setShowTransactionModal(false)}
                />
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
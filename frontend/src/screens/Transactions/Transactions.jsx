import { StyleSheet, FlatList, TouchableOpacity, Image, Text, View, Pressable, ActivityIndicator, useWindowDimensions } from 'react-native'
import { useState, useContext, useMemo, useLayoutEffect, useCallback } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { colorContext } from '@context/colorScheme'
import TransactionCard from '@components/transactions';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { useTransactionAuth } from '@context/transactionsContext';
import CustomLoader from '@components/contentLoader'
import CreateTransaction from '@components/createTransaction'
import FiltersTransactions from '@components/filtersTransactions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const NoData = require('@assets/no_data.png')

// TODO:  refatorar e otimizar
const Transactions = () => {
    const insets = useSafeAreaInsets();
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
        { label: 'Data de Ocorrência ↓', value: 'date_desc' },
        { label: 'Data de Ocorrência ↑', value: 'date_asc' },
        { label: 'Data de Criação ↓', value: 'id_desc' },
        { label: 'Data de Criação ↑', value: 'id_asc' },
        { label: 'Valor ↓', value: 'value_desc' },
        { label: 'Valor ↑', value: 'value_asc' },
    ];
    const filterOptions = [
        { label: 'Valor', value: 'value' },
        { label: 'Data', value: 'date' },
        { label: 'Categorias', value: 'categories' },
    ];
    const [selectedFilterOption, setSelectedFilterOption] = useState(null);

    const handleFilter = ({ label, value, type, queryLabel }) => {
        setFiltrosChips(prev =>
            [...prev.filter(f => f.type !== type), { label, type, queryLabel }]
        );
        setFilters(prev => ({ ...prev, [queryLabel]: value }));
        setSelectedFilterOption(null);
        setIsOpen({ sort: false, filters: false });
    };
    const [refreshing, setRefreshing] = useState(false);
    const [dropdownVisibleId, setDropdownVisibleId] = useState(null);
    const [selected, setSelected] = useState(sortOptions[0]);
    const [isOpen, setIsOpen] = useState({ sort: false, filters: false });
    const { isDarkMode } = useContext(colorContext);
    const [filtrosChips, setFiltrosChips] = useState([]);
    const allData = useMemo(() => data?.pages?.flatMap(page => page.data) || [], [data]);
    const toggleDropdown = (key) => {
        setIsOpen(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };
    const navigation = useNavigation();
    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    // useFocusEffect(
    //     useCallback(() => {
    //         onRefresh();
    //     }, [serializedFilters, filters])
    // );

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


    const renderItem = useCallback(({ item }) => (
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
            tipo={item?.tipo}
            item={item}
        />
    ), [allData, isDarkMode, dropdownVisibleId]);

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

    const removeFiltro = (filtro) => {
        setFiltrosChips(prev => prev.filter(item => item !== filtro));
        setFilters({ ...filters, [filtro.queryLabel]: '' });
    };

    const handleSort = (order = null) => {
        if (order) {
            setSelected(order);
            switch (order.value) {
                case "date_asc":
                    setFilters(prev => ({ ...prev, orderBy: 'data_transacao', orderDirection: 'ASC' }));
                    break;
                case "date_desc":
                    setFilters(prev => ({ ...prev, orderBy: 'data_transacao', orderDirection: 'DESC' }));
                    break;
                case "value_asc":
                    setFilters(prev => ({ ...prev, orderBy: 'valor', orderDirection: 'ASC' }));
                    break;
                case "value_desc":
                    setFilters(prev => ({ ...prev, orderBy: 'valor', orderDirection: 'DESC' }));
                    break;
                case "id_desc":
                    setFilters(prev => ({ ...prev, orderBy: 'transaction_id', orderDirection: 'DESC' }));
                    break;
                case "id_asc":
                    setFilters(prev => ({ ...prev, orderBy: 'transaction_id', orderDirection: 'ASC' }));
                    break;
            }
        } else {
            setFiltrosChips([]);
            setFilters({ tipo, orderBy: 'transaction_id', orderDirection: 'DESC' });
            setSelectedFilterOption(null);
        }
    };

    const clearFilters = () => {
        setFiltrosChips([]);
        setFilters({ tipo, orderBy: 'transaction_id', orderDirection: 'DESC' });
        setSelectedFilterOption(null);
    }

    return (
        <>

            <View style={{ backgroundColor: isDarkMode ? "#2e2e2e" : '#22C55E' }}>

                <View style={[styles.Container, { backgroundColor: isDarkMode ? "#2e2e2e" : "#ffffffd5" }]}>
                    {(isOpen.sort || isOpen.filters) && (
                        <Pressable
                            onPress={() => setIsOpen({ sort: false, filters: false })}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zIndex: 10,
                            }}
                        />
                    )}
                    <FiltersTransactions
                        isDarkMode={isDarkMode}
                        isOpen={isOpen}
                        toggleDropdown={toggleDropdown}
                        sortOptions={sortOptions}
                        filterOptions={filterOptions}
                        selectedFilterOption={selectedFilterOption}
                        setSelectedFilterOption={setSelectedFilterOption}
                        handleFilter={handleFilter}
                        filtrosChips={filtrosChips}
                        removeFiltro={removeFiltro}
                        handleSort={handleSort}
                        clearFilters={clearFilters}
                    />
                    {allData.length > 0 ? (
                        <>


                            <FlatList
                                data={allData}
                                keyExtractor={(item) => item.transaction_id.toString()}
                                renderItem={renderItem}
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                onEndReached={handleLoadMore}
                                onEndReachedThreshold={0.8}
                                initialNumToRender={10}
                                windowSize={5}
                                maxToRenderPerBatch={10}
                                updateCellsBatchingPeriod={60}
                                contentContainerStyle={{ paddingBottom: (filtrosChips.length > 0 ? 250 : 150) }}
                                ListFooterComponent={() => (
                                    <>
                                        {isFetchingNextPage && (
                                            <View style={{ paddingVertical: 25 }}>
                                                <ActivityIndicator size="large" color={isDarkMode ? "#BBB" : "#122370"} />
                                            </View>
                                        )}
                                        <View style={{ height: 100 }} />
                                    </>
                                )}
                            />
                        </>
                    ) : (
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: filtrosChips.length > 0 ? 400 : 600, paddingBottom: 64 }}>
                            <Image source={NoData} style={{ width: 250, height: 250 }} />
                            <Text style={{ fontSize: 18, fontWeight: '500', color: isDarkMode ? '#a1a1a1' : '#555' }}> Nada por aqui...</Text>
                        </View>
                    )
                    }

                </View>

            </View>
            <TouchableOpacity
                style={{ backgroundColor: '#222', borderRadius: 60, position: 'absolute', bottom: insets.bottom + 30, right: 35 }}
                onPress={() => setShowTransactionModal(true)}
            >
                <MaterialIcons name="add-circle" size={64} color={"#1b90df"}
                />
            </TouchableOpacity>
            <CreateTransaction
                isOpen={showTransactionModal}
                setIsOpen={() => setShowTransactionModal(false)}
            />
        </>

    );
}

export default Transactions

const styles = StyleSheet.create({
    Container: {
        minHeight: '100%',
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        paddingHorizontal: 15,
        paddingTop: 30,
        position: 'relative'

    },
})
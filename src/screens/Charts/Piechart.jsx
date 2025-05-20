import { StyleSheet, View, FlatList, TouchableOpacity, Text, ScrollView } from 'react-native';
import React, { useContext, useMemo, useState } from 'react'
import { colorContext } from '@context/colorScheme';
import PieChart from '@components/pieChart';
import { useTransactionAuth } from '@context/transactionsContext';
import Card from '@components/card';
import { useTransactionSummary } from '@hooks/useTransactionSummary';
import { categoriaCores } from '@utils/categoriasCores';

// TODO: Event Handler que ao clicar no grafico redirecione para a pagina de transações com a categoria filtrada 

export default function Piechart() {
    const { dadosCategorias } = useTransactionAuth();
    const { data, } = useTransactionSummary({});
    const { isDarkMode } = useContext(colorContext)
    const [selectedItem, setSelectedItem] = useState(null);
    const groupedData = data?.reduce((acc, item) => {
        const week = `S${item.name_interval}`;
        const tipo = item.tipo;
        const valor = parseFloat(item.valor);
        if (!acc[week]) {
            acc[week] = { despesa: 0, receita: 0 };
        }
        acc[week][tipo] += valor;

        return acc;
    }, {});


    const handleSelectItem = (label) => {
        setSelectedItem(() => label);
    };

    const total = dadosCategorias?.reduce((acc, item) => {
        acc += item.total
        return acc
    }, 0)


    return (
        <ScrollView contentContainerStyle={{ gap: 16, marginTop: 16 }} style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
            <View style={[styles.chart, { backgroundColor: isDarkMode ? '#222' : '#fffefe' }]}>
                <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>Transações por categorias</Text>
                <PieChart
                    height={350}
                    width={350}
                    padAngle={3}
                    data={dadosCategorias}
                    total={total}
                    selected={selectedItem}
                />
            </View>
            <FlatList
                data={dadosCategorias}
                keyExtractor={(item) => item.categoria}
                scrollEnabled={false}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={5}
                renderItem={({ item }) => (
                    <Card
                        color={categoriaCores[item.categoria]}
                        title={item.categoria}
                        text={(item.total)}
                        selectedItem={selectedItem}
                        selected={selectedItem === item.categoria ? selectedItem : 'none'}
                        onPress={() => handleSelectItem(item.categoria)}
                    />
                )}
            />


        </ScrollView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 600,
        marginTop: 16,
        marginLeft: 8,
    },
    container: {
        backgroundColor: '#fff',
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        padding: 10,
    },
    chart: {
        elevation: 1,
        padding: 16,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ccc'
    },
});
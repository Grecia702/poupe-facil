import { Pressable, StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useContext, useMemo, useState } from 'react'
import { colorContext } from '@context/colorScheme';
import PieChart from '@components/pieChart';
import { useTransactionAuth } from '@context/transactionsContext';
import { WidgetView } from '@components/transactions/styles';
import Card from '@components/card';

const groupByCategory = ((dadosAPI) => {
    if (!dadosAPI) {
        return [];
    }

    return Object.values(
        dadosAPI.reduce((acc, item) => {
            const valor = parseFloat(item.valor);
            if (!acc[item.categoria]) {
                acc[item.categoria] = { x: item.categoria, y: 0, z: 0 };
            }
            acc[item.categoria].y += valor;
            acc[item.categoria].z += 1;
            return acc;
        }, {})
    );
});

const GroupByType = ((dadosAPI) => {
    return dadosAPI?.reduce((acc, item) => {
        const valor = parseFloat(item.valor)
        if (item.tipo === "Despesa") {
            acc.despesas -= valor;
        }
        else {
            acc.receitas += valor;
        }
        return acc;
    }, { receitas: 0, despesas: 0 })
})

export default function New() {
    const { dadosAPI } = useTransactionAuth();
    const { isDarkMode } = useContext(colorContext)
    const [selectedItem, setSelectedItem] = useState(null);
    const saldoTotal = (transacoes?.receitas - transacoes?.despesas)

    const resultGroupBy = useMemo(() => {
        return groupByCategory(dadosAPI);
    }, [dadosAPI])

    const transacoes = useMemo(() => {
        return GroupByType(dadosAPI);
    }, [dadosAPI])

    const handleSelectItem = (label) => {
        setSelectedItem(label);
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? 'rgb(30, 30, 30)' : 'rgb(199, 199, 199)' }]}>

            <WidgetView color={isDarkMode ? "#2e2e2e" : "#ffffffd5"}>
                <PieChart height={350} width={350} data={resultGroupBy} total={saldoTotal} selected={selectedItem} />
            </WidgetView>
            <FlatList
                data={resultGroupBy}
                keyExtractor={(item) => item.x}
                // refreshing={refreshing}
                scrollEnabled={false}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={5}
                renderItem={({ item }) => (
                    <Card
                        color={'black'}
                        title={item.x}
                        text={(item.y).toFixed(2)}
                        selected={selectedItem === item.x || selectedItem === true}
                        onPress={() => handleSelectItem(item.x)}
                    />
                )}
            />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        borderWidth: 2,
        borderRadius: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: 600,
    }
});
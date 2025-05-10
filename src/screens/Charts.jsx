import { StyleSheet, View, FlatList, TouchableOpacity, Text, ScrollView } from 'react-native';
import React, { useContext, useMemo, useState } from 'react'
import { colorContext } from '../../context/colorScheme';
import PieChart from '@components/pieChart';
import { useTransactionAuth } from '@context/transactionsContext';
import { VictoryBar, VictoryLine, VictoryAxis, VictoryChart, VictoryTheme, VictoryGroup } from 'victory-native';
import Card from '@components/card';
import { MaterialIcons } from '@expo/vector-icons'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTransactionSummary } from '@hooks/useTransactionSummary';
import { categoriaCores } from '../utils/categoriasCores';

const BarChart = ({ data, color }) => {

    return (
        <>

            <VictoryChart theme={VictoryTheme.grayscale} width={370}
            >
                <VictoryAxis
                    style={{
                        tickLabels: { fontSize: 16, fill: color ? "#d1d1d1" : "#000000" },
                        axis: {
                            stroke: color ? "#c5c5c5" : "#000000",
                            strokeWidth: 2,
                        },
                    }}
                // domain={{ y: [0, 600] }}
                // tickValues={[0, 100, 200, 300, 400, 500, 600]}
                />
                <VictoryAxis
                    dependentAxis
                    style={{
                        tickLabels: { fontSize: 16, fill: color ? "#d1d1d1" : "#000000" },
                        axis: {
                            stroke: color ? "#d1d1d1" : "#000000",
                            strokeWidth: 2,
                        },
                    }}
                />

                <VictoryGroup offset={50} colorScale={["#a73a3a", "#32a136"]}>
                    <VictoryBar
                        data={data}
                        x="week"
                        y="despesa"
                        // labels={({ datum }) => `R$${datum.despesa}`}
                        style={{
                            data: { fill: "#c21414" },
                            labels: { fontSize: 12, fill: "#000000" },
                        }}
                    />
                    <VictoryBar
                        data={data}
                        x="week"
                        y="receita"
                        // labels={({ datum }) => `R$${datum.receita}`}
                        style={{
                            data: { fill: "#4486db" },
                            labels: { fontSize: 12, fill: "#000000" },
                        }}
                    />
                </VictoryGroup>
            </VictoryChart>
        </>
    )
}

// TODO: Event Handler que ao clicar no grafico redirecione para a pagina de transações com a categoria filtrada 

export default function New() {
    const { dadosCategorias } = useTransactionAuth();
    const { data, refetch, isLoading, error } = useTransactionSummary({});
    const { data: lineChartData } = useTransactionSummary({
        period: 'day'
    });
    const expenseEvolution = lineChartData?.filter(item => item.tipo === 'despesa' && item.natureza === 'variavel')
    const incomeEvolution = lineChartData?.filter(item => item.tipo === 'receita' && item.natureza === 'variavel')

    const { isDarkMode } = useContext(colorContext)
    const [selectedItem, setSelectedItem] = useState(null);
    const [chartVisible, setChartVisible] = useState('pie');
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


    const chartData = groupedData
        ? Object.entries(groupedData).map(([week, values]) => ({
            week,
            despesa: values.despesa,
            receita: values.receita,
        }))
        : [];

    const handleSelectItem = (label) => {
        setSelectedItem(() => label);
    };

    const total = dadosCategorias?.reduce((acc, item) => {
        acc += item.total
        return acc
    }, 0)

    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: withTiming(opacity.value, { duration: 300 }),
        transform: [{ scale: withTiming(scale.value, { duration: 300 }) }],
    }));

    const toggleChart = (chart) => {
        if (chart === chartVisible) {
            return;
        }

        opacity.value = 0;
        scale.value = 0.95;
        setTimeout(() => {
            setChartVisible(chart);
            opacity.value = 1;
            scale.value = 1;
        }, 300);
    };



    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }} style={[styles.card, { backgroundColor: isDarkMode ? 'rgb(26, 26, 26)' : '#dfdfdfd4' }]}>
            <View style={[styles.navbar, { borderColor: isDarkMode ? "#c2c2c2d4" : "#333", backgroundColor: isDarkMode ? "#333" : "#ffffffd5" }]}>
                <TouchableOpacity style={styles.navbarItem} onPress={() => toggleChart('pie')}>
                    <MaterialIcons name="pie-chart" size={24} color={isDarkMode ? "#ffffff" : "#000000"} />
                </TouchableOpacity >
                <View style={{ width: 1, backgroundColor: isDarkMode ? "#c2c2c2d4" : "#333" }} />
                <TouchableOpacity style={styles.navbarItem} onPress={() => toggleChart('bar')}>
                    <MaterialIcons name="bar-chart" size={24} color={isDarkMode ? "#ffffff" : "#000000"} />
                </TouchableOpacity>
                <View style={{ width: 1, backgroundColor: isDarkMode ? "#c2c2c2d4" : "#333" }} />
                <TouchableOpacity style={styles.navbarItem} onPress={() => toggleChart('line')}>
                    <MaterialIcons name="show-chart" size={24} color={isDarkMode ? "#ffffff" : "#000000"} />
                </TouchableOpacity>
            </View>

            <Animated.View style={[animatedStyle, { marginBottom: 20 }]}>
                {chartVisible === 'pie' && (
                    <>
                        <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>Transações por categorias</Text>
                        <PieChart
                            height={350}
                            width={350}
                            padAngle={3}
                            data={dadosCategorias}
                            total={total}
                            selected={selectedItem}
                        />
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
                    </>
                )}
                {chartVisible === 'bar' && (
                    <>
                        <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>Receita x Despesas</Text>
                        <BarChart

                            color={isDarkMode}
                            data={chartData}
                            colorScheme={categoriaCores}
                            selectedItem={selectedItem}
                        />
                    </>
                )}
                {chartVisible === 'line' && (
                    <>
                        <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>Evolução das despesas</Text>
                        <VictoryChart theme={VictoryTheme.material}
                            padding={{ left: 65, right: 40, bottom: 50, top: 50 }}
                            domain={{ y: [0, Math.max(...data.map(item => item.valor)) + 50] }}
                            domainPadding={{ x: [0, 0], y: [0, 0] }}>
                            <VictoryAxis
                                style={{
                                    tickLabels: { fontSize: 16, fill: isDarkMode ? "#c0c0c0" : "#000000" },
                                    grid: { stroke: '#686faa6a' },
                                    axis: {
                                        stroke: isDarkMode ? "#c0c0c0" : "#000000",
                                        strokeWidth: 3
                                    },
                                }}
                            />
                            <VictoryAxis
                                tickValues={
                                    Array.from(
                                        { length: data.length },
                                        (_, i) => i * (Math.max(...data.map(item => item.valor)) / data.length)
                                    )
                                }
                                dependentAxis
                                style={{
                                    tickLabels: { fontSize: 14, fill: isDarkMode ? "#c0c0c0" : "#000000" },
                                    grid: { stroke: '#686faa6a' },
                                    axis: {
                                        stroke: isDarkMode ? "#c0c0c0" : "#000000",
                                        strokeWidth: 3
                                    },
                                }}
                            />
                            <VictoryLine
                                data={expenseEvolution}
                                interpolation={'monotoneX'}
                                x="name_interval"
                                y="valor"
                                style={{
                                    data: { stroke: "#be372e", strokeWidth: 5 },
                                }}
                            />
                            <VictoryLine
                                data={incomeEvolution}
                                interpolation={'monotoneX'}
                                x="name_interval"
                                y="valor"
                                style={{
                                    data: { stroke: "#382ebe", strokeWidth: 5 },
                                }}
                            />
                        </VictoryChart>
                    </>
                )}
            </Animated.View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
    },
    title: {
        alignSelf: 'center',
        fontSize: 24,
        fontWeight: 600,
        marginTop: 50
    },
    card: {
        flexDirection: 'column',
        padding: 20,
    },
    navbar: {
        justifyContent: 'space-between',
        alignSelf: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        width: 150,
        height: 35,
        borderRadius: 5,
        elevation: 5,
    },
    navbarItem: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
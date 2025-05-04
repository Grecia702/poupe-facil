import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useContext, useMemo, useState } from 'react'
import { colorContext } from '../../context/colorScheme';
import PieChart from '@components/pieChart';
import { useTransactionAuth } from '@context/transactionsContext';
import { WidgetView } from '@components/transactions/styles';
import { VictoryBar, VictoryLine, VictoryAxis, VictoryChart, VictoryTheme } from 'victory-native';
import Card from '@components/card';
import { MaterialIcons } from '@expo/vector-icons'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const groupByCategory = ((dadosAPI) => {
    if (!dadosAPI) {
        return [];
    }

    return Object.values(
        dadosAPI.reduce((acc, item) => {
            const valor = Math.abs(parseFloat(item.valor));
            if (item?.tipo === "Despesa") {
                acc[item.categoria] = acc[item.categoria] || { x: item.categoria, y: 0, z: 0 };
                acc[item.categoria].y += valor;
                acc[item.categoria].z += 1;
            }
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

const BarChart = ({ data, colorScheme, color, selectedItem }) => {
    console.log(data)

    return (
        <>
            <VictoryChart
                style={{
                    parent: { alignSelf: 'center', marginLeft: 60 },
                    axis: {
                        stroke: color ? "#ffffff" : "#000000",
                    },
                    grid: {
                        stroke: color ? "#555555" : "#e6e6e6",
                        strokeDasharray: "4, 4",
                    },
                    ticks: {
                        size: 5,
                        stroke: color ? "#ffffff" : "#000000",
                    },
                    tickLabels: {
                        fontSize: 16,
                        fill: color ? "#ffffff" : "#000000",
                    },
                }}
                domain={{ y: [0, Math.max(...data.map(item => item.y)) + 100] }}
                domainPadding={{ x: 10 }}
                theme={VictoryTheme.clean}

            >
                <VictoryAxis
                    style={{

                        tickLabels: { fontSize: 12, fontWeight: 500, fill: color ? "#ffffff" : "#000000" },
                    }}
                />
                <VictoryAxis
                    dependentAxis
                    tickFormat={(tick) => `R$${tick}`}
                    style={{
                        grid: {
                            stroke: color ? "#b0bec49f" : "#345499",
                            strokeDasharray: "10, 5",
                        },
                        tickLabels: { fontSize: 16, fontWeight: 600, fill: color ? "#ffffff" : "#000000" },
                    }}
                />

                <VictoryBar
                    data={data}
                    // animate={{ duration: 500, easing: "bounce" }}
                    labels={({ datum }) => datum.x === selectedItem ? ` ${Math.round(datum.z)} transações` : ""}
                    style={{
                        data: {
                            opacity: ({ datum }) => (datum.x === selectedItem || selectedItem === "") ? 1 : 0.5,
                            fill: ({ datum }) => (colorScheme[datum.x] ? colorScheme[datum.x] : 'none'),
                            strokeWidth: 3,
                        },

                        labels: {
                            fontWeight: 500,
                            fontSize: 20,
                            fill: color ? "#dbd4d4" : "#24201f"
                        }

                    }}
                />
            </VictoryChart>
        </>
    )
}

export default function New() {
    const { dadosAPI } = useTransactionAuth();
    const { isDarkMode } = useContext(colorContext)
    const [selectedItem, setSelectedItem] = useState(null);
    const [chartVisible, setChartVisible] = useState('pie');
    const categoriaCores = {
        Contas: "rgb(160, 48, 44)",
        Alimentação: "rgb(204, 118, 38)",
        Carro: "rgb(57, 184, 74)",
        Internet: "rgb(64, 155, 230)",
        Lazer: "rgb(114, 13, 109)",
        Educação: "rgb(68, 59, 90)",
        Compras: "rgb(148, 137, 37)",
        Outros: "rgb(83, 87, 83)",
    };

    const resultGroupBy = useMemo(() => {
        return groupByCategory(dadosAPI).sort((a, b) => (a.y) - (b.y));
    }, [dadosAPI])

    // console.log(resultGroupBy);
    const transacoes = useMemo(() => {
        return GroupByType(dadosAPI);
    }, [dadosAPI])

    const handleSelectItem = (label) => {
        setSelectedItem(label);
    };

    // const toggleChart = (chart) => {
    //     setChartVisible(chart);
    // }

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
        scale.value = 0.9;
        setTimeout(() => {
            setChartVisible(chart);
            opacity.value = 1;
            scale.value = 1;
        }, 300);
    };



    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? 'rgb(30, 30, 30)' : 'rgb(199, 235, 214)' }]}>
            <View style={[styles.card, { backgroundColor: isDarkMode ? '#333' : '#ffffffd5' }]}>
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

                <Animated.View style={[animatedStyle]}>
                    {chartVisible === 'pie' && (
                        <PieChart
                            height={350}
                            width={350}
                            data={resultGroupBy}
                            total={transacoes?.despesas}
                            selected={selectedItem}
                        />
                    )}
                    {chartVisible === 'bar' && (
                        <BarChart
                            color={isDarkMode}
                            data={resultGroupBy}
                            colorScheme={categoriaCores}
                            selectedItem={selectedItem}
                        />
                    )}
                    {chartVisible === 'line' && (
                        <VictoryChart theme={VictoryTheme.material} domainPadding={{ x: 50 }}>
                            <VictoryAxis
                                style={{
                                    tickLabels: { fontSize: 16, fill: isDarkMode ? "#ffffff" : "#000000" },
                                }}
                            />
                            <VictoryAxis
                                dependentAxis
                                style={{
                                    tickLabels: { fontSize: 16, fill: isDarkMode ? "#ffffff" : "#000000" },
                                }}
                            />
                            <VictoryLine
                                data={resultGroupBy}
                                style={{
                                    data: { stroke: isDarkMode ? "#ffffff" : "#000000", strokeWidth: 2 },
                                }}
                            />
                        </VictoryChart>
                    )}
                </Animated.View>
            </View>
            <FlatList
                data={resultGroupBy}
                keyExtractor={(item) => item.x}
                // refreshing={refreshing}
                scrollEnabled={true}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={5}
                renderItem={({ item }) => (
                    <Card
                        color={categoriaCores[item.x]}
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
        padding: 15,
        flex: 1,
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
    },
    card: {
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20,
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
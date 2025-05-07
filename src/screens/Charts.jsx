import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import React, { useContext, useMemo, useState } from 'react'
import { colorContext } from '../../context/colorScheme';
import PieChart from '@components/pieChart';
import { useTransactionAuth } from '@context/transactionsContext';
import { VictoryBar, VictoryLine, VictoryAxis, VictoryChart, VictoryTheme, VictoryGroup } from 'victory-native';
import Card from '@components/card';
import { MaterialIcons } from '@expo/vector-icons'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const BarChart = ({ dataX, dataY }) => {

    return (
        <>

            <VictoryChart theme={VictoryTheme.material}>
                <VictoryAxis />
                <VictoryAxis dependentAxis />

                <VictoryGroup offset={40}>
                    <VictoryBar
                        data={dataX}
                        x="tipo"
                        y="valor"
                    />
                    <VictoryBar
                        data={dataY}
                        x="tipo"
                        y="valor"

                    />
                    {/* <VictoryBar
                        data={dataX}
                        x="tipo"
                        y="valor"
                    />
                    <VictoryBar
                        data={dataY}
                        x="tipo"
                        y="valor"
                    /> */}

                </VictoryGroup>
            </VictoryChart>
        </>
    )
}

// TODO: Event Handler que ao clicar no grafico redirecione para a pagina de transações com a categoria filtrada 

export default function New() {
    const { dadosAgrupados, dadosAgrupadosLoading, dadosCategorias } = useTransactionAuth();
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


    const ReceitasFixas = [dadosAgrupados?.find(item => item.natureza === "fixa" && item.tipo === "despesa")]
    const ReceitasVariadas = [dadosAgrupados?.find(item => item.natureza === "variada" && item.tipo === "despesa")]
    const DespesasFixas = [dadosAgrupados?.find(item => item.natureza === "fixa" && item.tipo === "receita")]
    const Despesasvariadas = [dadosAgrupados?.find(item => item.natureza === "variada" && item.tipo === "receita")]

    console.log(DespesasFixas)
    console.log(ReceitasFixas)
    // console.log(Despesas)

    // if (dadosAgrupadosLoading) {
    //     console.log("true")
    // }

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
                        <>
                            <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>Transações por categorias</Text>
                            <PieChart
                                height={350}
                                width={350}
                                data={dadosCategorias}
                                total={total}
                                selected={selectedItem}
                            />
                        </>
                    )}
                    {chartVisible === 'bar' && (
                        <>
                            <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>Receita x Despesas</Text>
                            <BarChart
                                color={isDarkMode}
                                dataX={DespesasFixas}
                                dataY={ReceitasFixas}
                                colorScheme={categoriaCores}
                                selectedItem={selectedItem}
                            />
                        </>
                    )}
                    {chartVisible === 'line' && (
                        <>
                            <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>Evolução das despesas</Text>
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
                        </>
                    )}
                </Animated.View>
            </View>
            <FlatList
                data={dadosCategorias}
                keyExtractor={(item) => item.categoria}
                // refreshing={refreshing}
                scrollEnabled={true}
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
    title: {
        alignSelf: 'center',
        fontSize: 24,
        fontWeight: 600,
        marginTop: 50
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
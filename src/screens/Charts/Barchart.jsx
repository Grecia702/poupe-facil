import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import React, { useContext, useMemo, useState } from 'react'
import { Dimensions } from 'react-native';
import { colorContext } from '@context/colorScheme';
import { VictoryBar, VictoryAxis, VictoryChart, VictoryTheme, VictoryTooltip, VictoryStack } from 'victory-native';
import { useTransactionSummary } from '@hooks/useTransactionSummary';
import { startOfMonth } from 'date-fns/startOfMonth';
import DateButtonNavigation from '../../components/dateButtonNavigation';
import { startOfDay } from 'date-fns';

const BarChart = ({ data, color }) => {
    const { width } = Dimensions.get('window');
    return (
        <>

            <VictoryChart theme={VictoryTheme.grayscale}
                width={width * 0.9}
                height={325}
                padding={{ left: 90, right: 10, bottom: 30, top: 70, }}
                domain={{ x: [0.5, 4.5] }}
            >
                <VictoryAxis
                    style={{
                        tickLabels: { fontSize: 16, fill: color ? "#d1d1d1" : "#000000" },
                        axis: {
                            stroke: color ? '#686faa6a' : "#b4b4b4c7",
                            strokeWidth: 2,
                        },

                    }}
                />
                <VictoryAxis
                    dependentAxis
                    tickFormat={(t) => `R$ ${t.toLocaleString('pt-BR')}`}
                    style={{
                        grid: {
                            stroke: color ? '#686faa6a' : "#b4b4b48f",
                            strokeWidth: 2,
                        },
                        tickLabels: { fontSize: 16, fill: color ? "#d1d1d1" : "#000000" },
                        axis: { stroke: "none" },
                    }}
                />

                <VictoryStack offset={0} >
                    <VictoryBar
                        data={data}
                        x="week"
                        y="despesa"
                        labels={({ datum }) => [
                            `Despesa: R$ ${datum.despesa.toLocaleString('pt-BR')}`,
                            `Receita: R$ ${datum.receita.toLocaleString('pt-BR')}`
                        ]}
                        activateData={true}
                        activateLabels={true}
                        barWidth={40}
                        style={{
                            data: { fill: color ? "#882e2e" : "#cc4646" },
                            labels: { fontSize: 16, fill: "#000000" },
                        }}
                        labelComponent={
                            <VictoryTooltip

                                flyoutStyle={{
                                    fill: "#fff",
                                    stroke: "#ccc",
                                    strokeWidth: 1,
                                    shadowColor: "#000",
                                }}
                                style={{
                                    fill: "#333",
                                    fontSize: 16,
                                    fontWeight: "500",
                                }}
                                cornerRadius={6}
                                flyoutPadding={{ top: 10, bottom: 10, left: 15, right: 15 }}
                            />
                        }

                    />
                    <VictoryBar
                        data={data}
                        x="week"
                        y="receita"
                        labels={({ datum }) => [
                            `Despesa: R$ ${datum.despesa.toLocaleString('pt-BR')}`,
                            `Receita: R$ ${datum.receita.toLocaleString('pt-BR')}`
                        ]}
                        barWidth={40}
                        cornerRadius={{ top: 4 }}
                        style={{
                            data: {
                                fill: color ? "#258d48" : "#31c763"
                            },
                            labels: { fontSize: 16, fill: "#000000" },
                        }}
                        labelComponent={
                            <VictoryTooltip
                                flyoutStyle={{
                                    fill: "#fff",
                                    stroke: "#ccc",
                                    strokeWidth: 1,
                                    shadowColor: "#000",
                                }}
                                style={{
                                    fill: "#333",
                                    fontSize: 16,
                                    fontWeight: "500",
                                }}
                                cornerRadius={6}
                                flyoutPadding={{ top: 10, bottom: 10, left: 15, right: 15 }}
                            />
                        }
                    />
                </VictoryStack>
            </VictoryChart>
        </>
    )
}

export default function Barchart() {
    const { isDarkMode } = useContext(colorContext)
    const [lastDate, setLastDate] = useState(startOfMonth(new Date()))
    const [firstDate, setFirstDate] = useState(startOfDay(new Date()))
    const { data, isLoading } = useTransactionSummary({});


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
        ? Object.entries(groupedData)?.map(([week, values]) => ({
            week,
            despesa: values.despesa,
            receita: values.receita,
        }))
        : [];
    const totalSemana = chartData?.reduce((acc, item) => {
        acc.despesa += item.despesa
        acc.receita += item.receita
        return acc
    }, { despesa: 0, receita: 0 })

    const handleDate = (label) => {
        if (label === 'prev') {
            setFirstDate(prev => subDays(prev, 7))
            setLastDate(prev => subDays(prev, 7))
            console.log(semana)
        }
        if (label === 'next') {
            setFirstDate(prev => addDays(prev, 7))
            setLastDate(prev => addDays(prev, 7))
        }
    }

    return (
        <ScrollView contentContainerStyle={{ gap: 16, marginTop: 16 }} style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
            <View style={{ alignSelf: 'center', marginTop: 24 }}>
                <Text style={[styles.legend, { color: isDarkMode ? '#ddd' : '#111' }]}>Total Despesas: <Text style={{ fontWeight: 'bold' }}>{totalSemana.despesa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text></Text>
                <Text style={[styles.legend, { color: isDarkMode ? '#ddd' : '#111' }]}>Total Receitas: <Text style={{ fontWeight: 'bold' }}>{totalSemana.receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text></Text>
            </View>
            <View style={[styles.chart, { backgroundColor: isDarkMode ? '#222' : '#fffefe', borderColor: isDarkMode ? '#444' : '#ccc', }]}>
                <Text style={[styles.title, { color: isDarkMode ? '#ddd' : '#111' }]}>
                    Receita x despesas por semana
                </Text>
                {!isLoading && (
                    <BarChart
                        color={isDarkMode}
                        data={chartData}
                    />
                )}
            </View>
            <DateButtonNavigation
                prevAction={() => handleDate('prev')}
                nextAction={() => handleDate('next')}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 10,
        width: '100%',
        flexDirection: 'column',
    },
    text: {
        fontSize: 20,
        fontWeight: 600,
    },
    title: {
        fontSize: 24,
        fontWeight: 600,
        marginTop: 24,
        marginLeft: 8,
    },
    legend: {
        textAlign: 'left',
        fontSize: 18,
        fontWeight: 400,
        marginBottom: 8,
    },
    chart: {
        padding: 8,
        borderRadius: 24,
        borderWidth: 2
    }
});
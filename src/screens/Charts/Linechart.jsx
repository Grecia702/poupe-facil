import { StyleSheet, View, Text, ScrollView } from 'react-native';
import React, { useContext, useMemo, useState } from 'react'
import { colorContext } from '@context/colorScheme';
import { VictoryLine, VictoryLabel, VictoryAxis, VictoryChart, VictoryTheme, VictoryTooltip, VictoryScatter } from 'victory-native';
import { useTransactionSummary } from '@hooks/useTransactionSummary';
import { subDays, startOfDay, addDays } from 'date-fns/'
import DateButtonNavigation from '@components/dateButtonNavigation';
import { Dimensions } from 'react-native';

export default function Linechart() {
    const { isDarkMode } = useContext(colorContext)
    const [lastDate, setLastDate] = useState(new Date())
    const [firstDate, setFirstDate] = useState(subDays(lastDate, 6))
    const { data: lineChartData, isLoading } = useTransactionSummary({
        first_day: firstDate,
        last_day: lastDate,
        period: 'day'
    });

    const total = lineChartData?.filter(item => item.tipo === 'despesa')
        .reduce((acc, item) => {
            return acc += item.valor
        }, 0) || 0

    const expenses = (lineChartData || []).filter(item => item.tipo === 'despesa');

    const totalExpensesByDay = Object.values(
        expenses?.reduce((acc, item) => {
            const key = item.date_interval;
            const ocorrencias = parseInt(item.ocorrencias)

            if (!acc[key]) {
                acc[key] = {
                    date_interval: new Date(key),
                    name_interval: item.name_interval,
                    ocorrencias: 0,
                    valor: 0
                };
            }
            acc[key].ocorrencias += ocorrencias
            acc[key].valor += item.valor;
            return acc;
        }, {})
    ) || [{ date_interval: startOfDay(new Date()), valor: 0, ocorrencias: 0, name_interval: 1 }];

    const valores = totalExpensesByDay?.map(item => ({
        valor: item.valor, dia: item.date_interval.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            timeZone: 'UTC'
        })
    })) || []
    const maiorValor = valores.reduce((acc, item) => item.valor > acc.valor ? item : acc, { valor: 0 });
    const mediaSemanal = maiorValor.valor / 7
    const screenWidth = Dimensions.get('window').width;
    const handleDate = (label) => {
        if (label === 'prev') {
            setFirstDate(prev => subDays(prev, 6))
            setLastDate(prev => subDays(prev, 6))
        }
        if (label === 'next') {
            setFirstDate(prev => addDays(prev, 6))
            setLastDate(prev => addDays(prev, 6))
        }
    }

    return (
        <ScrollView contentContainerStyle={{ gap: 16, marginTop: 16 }} style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f7f7f8' }]}>
            <View style={styles.cardItems}>
                <View style={[styles.card, { backgroundColor: isDarkMode ? '#222' : '#fffefe', }]}>
                    <Text style={[styles.cardText, { color: isDarkMode ? '#ccc' : '#4d5e6f' }]}>Despesas</Text>
                    <Text style={[styles.cardText, { color: isDarkMode ? '#ccc' : '#4d5e6f' }]}>Totais</Text>
                    <Text style={[styles.cardTextHighlight, { color: isDarkMode ? '#E0E0E0' : '#101f31' }]}>
                        {total?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Text>
                </View>
                <View style={[styles.card, { backgroundColor: isDarkMode ? '#222' : '#fffefe', }]}>
                    <Text style={[styles.cardText, { color: isDarkMode ? '#ccc' : '#4d5e6f' }]}>Despesa Média </Text>
                    <Text style={[styles.cardText, { color: isDarkMode ? '#ccc' : '#4d5e6f' }]}>Semanal</Text>
                    <Text style={[styles.cardTextHighlight, { color: isDarkMode ? '#E0E0E0' : '#101f31' }]}>
                        {mediaSemanal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Text>
                </View>
                <View style={[styles.card, { backgroundColor: isDarkMode ? '#222' : '#fffefe', }]}>
                    <Text style={[styles.cardText, { color: isDarkMode ? '#ccc' : '#4d5e6f' }]}>Dia de maior </Text>
                    <Text style={[styles.cardText, { color: isDarkMode ? '#ccc' : '#4d5e6f' }]}>Despesa</Text>
                    <Text style={[styles.cardTextHighlight, { color: isDarkMode ? '#E0E0E0' : '#101f31' }]}>{maiorValor.dia || 'Nenhuma'}</Text>
                </View>
            </View>

            <View style={[styles.chart, { backgroundColor: isDarkMode ? '#222' : '#fffefe' }]}>
                <Text style={[styles.title, { color: isDarkMode ? '#ccc' : '#091228' }]}>Evolução das despesas</Text>
                {totalExpensesByDay.length > 0 && (
                    <VictoryChart
                        theme={VictoryTheme.material}
                        height={350}
                        width={screenWidth}
                        padding={{ left: 65, right: 65, bottom: 90, top: 50 }}
                        domain={{ y: [0, (maiorValor?.valor || 0) + 100] }}
                    >
                        <VictoryLine
                            data={totalExpensesByDay}
                            interpolation="monotoneX"
                            x="date_interval"
                            y="valor"
                            style={{
                                data: { stroke: "#be372e", strokeWidth: 5 },
                            }}
                        // animate={{ duration: 500 }}
                        />

                        <VictoryAxis
                            fixLabelOverlap
                            tickLabelComponent={<VictoryLabel dy={10} textAnchor="middle" />}
                            tickValues={totalExpensesByDay.map(item => new Date(item.date_interval).getTime())}
                            tickFormat={(t) => {
                                const date = new Date(t);
                                const day = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', timeZone: 'UTC' }).format(date);
                                const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: 'UTC' }).format(date);
                                const month = new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' }).format(date);
                                return `${day}\n${weekday}\n${month}`;
                            }}
                            style={{
                                tickLabels: { fontSize: 16, fill: isDarkMode ? '#c0c0c0' : '#1d1d1d' },
                                grid: { stroke: '#686faa6a', strokeDasharray: '0', strokeWidth: 0.5 },
                                axis: { stroke: '#686faa6a', strokeWidth: 3 },
                            }}
                        />

                        <VictoryAxis
                            dependentAxis
                            tickFormat={(t) => `R$ ${t.toLocaleString('pt-BR')}`}
                            style={{
                                tickLabels: { fontSize: 14, fill: isDarkMode ? '#c0c0c0' : '#000000' },
                                grid: { stroke: '#686faa6a', strokeDasharray: '0', strokeWidth: 0.5 },
                                axis: { stroke: 'transparent' },
                            }}
                        />

                        <VictoryScatter
                            data={totalExpensesByDay}
                            x="date_interval"
                            y="valor"
                            size={7}
                            style={{ data: { fill: "#be372e" } }}
                            labels={({ datum }) => `Valor: R$${datum.valor}\n Ocorrências: ${datum.ocorrencias}`}
                            labelComponent={
                                <VictoryTooltip
                                    flyoutStyle={{
                                        fill: isDarkMode ? '#252525' : "#fff",
                                        stroke: "#9e9b9b",
                                        strokeWidth: 1,
                                        shadowColor: "#000",
                                    }}
                                    style={{
                                        fill: isDarkMode ? "#b1b0b0" : '#333',
                                        fontSize: 16,
                                        fontWeight: "500",
                                    }}
                                    cornerRadius={6}
                                    flyoutPadding={{ top: 10, bottom: 10, left: 15, right: 15 }}
                                />
                            }
                        />
                    </VictoryChart>


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
    title: {
        fontSize: 24,
        fontWeight: 600,
        marginTop: 16,
        marginLeft: 8,
    },
    container: {
        backgroundColor: '#f7f7f8',
        padding: 10,
        flex: 1,
        width: '100%',
        flexDirection: 'column',
    },
    card: {
        alignSelf: 'center',
        elevation: 1,
        height: 100,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    cardItems: {
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    cardText: {
        textAlign: 'left',
        fontSize: 16,
        fontWeight: '600',
    },
    cardTextHighlight: {
        textAlign: 'left',
        marginTop: 8,
        fontWeight: 'bold',
        fontSize: 18
    },
    chart: {
        elevation: 1,
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        height: 420
    },
});
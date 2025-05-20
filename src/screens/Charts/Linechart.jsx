import { StyleSheet, View, Text, ScrollView } from 'react-native';
import React, { useContext, useMemo, useState } from 'react'
import { colorContext } from '@context/colorScheme';
import { VictoryLine, VictoryLabel, VictoryAxis, VictoryChart, VictoryTheme, VictoryTooltip } from 'victory-native';
import { useTransactionSummary } from '@hooks/useTransactionSummary';
import { subDays, startOfDay, addDays } from 'date-fns/'
import DateButtonNavigation from '@components/dateButtonNavigation';

export default function Linechart() {
    const { isDarkMode } = useContext(colorContext)
    const [lastDate, setLastDate] = useState(startOfDay(new Date()))
    const [firstDate, setFirstDate] = useState(subDays(lastDate, 6))
    const { data: lineChartData, isLoading } = useTransactionSummary({
        first_day: firstDate,
        last_day: lastDate,
        period: 'day'
    });

    const [semana, setSemana] = useState(startOfDay(new Date()));

    const total = lineChartData?.reduce((acc, item) => {
        return acc += item.valor
    }, 0) || 0

    const incomes = (lineChartData || []).filter(item => item.tipo === 'despesa');
    const expenses = (lineChartData || []).filter(item => item.tipo === 'despesa');

    const totalExpensesByDay = Object.values(
        expenses?.reduce((acc, item) => {
            const key = item.date_interval;

            if (!acc[key]) {
                acc[key] = {
                    date_interval: new Date(key),
                    name_interval: item.name_interval,
                    ocorrencias: item.ocorrencias,
                    valor: 0
                };
            }

            acc[key].valor += item.valor;
            return acc;
        }, {})
    ) || [{ date_interval: startOfDay(new Date()), valor: 0, ocorrencias: 0, name_interval: 1 }];

    console.log(totalExpensesByDay)

    const valores = totalExpensesByDay?.map(item => ({
        valor: item.valor, dia: item.date_interval.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            timeZone: 'UTC'
        })
    })) || []
    const maiorValor = valores.reduce((acc, item) => item.valor > acc.valor ? item : acc, { valor: 0 });
    const mediaSemanal = maiorValor.valor / 7

    const handleDate = (label) => {
        if (label === 'prev') {
            setFirstDate(prev => subDays(prev, 6))
            setLastDate(prev => subDays(prev, 6))
            console.log(semana)
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
                    <Text style={[styles.cardTextHighlight, { color: isDarkMode ? '#E0E0E0' : '#101f31' }]}>R${total?.toLocaleString('pt-BR')}</Text>
                </View>
                <View style={[styles.card, { backgroundColor: isDarkMode ? '#222' : '#fffefe', }]}>
                    <Text style={[styles.cardText, { color: isDarkMode ? '#ccc' : '#4d5e6f' }]}>Despesa Média </Text>
                    <Text style={[styles.cardText, { color: isDarkMode ? '#ccc' : '#4d5e6f' }]}>Semanal</Text>
                    <Text style={[styles.cardTextHighlight, { color: isDarkMode ? '#E0E0E0' : '#101f31' }]}>R${mediaSemanal.toLocaleString('pt-BR')}</Text>
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
                    <VictoryChart theme={VictoryTheme.material}
                        height={350}
                        padding={{ left: 65, right: 60, bottom: 80, top: 30 }}
                        domain={{
                            y: [0, maiorValor.valor + 100]
                        }}

                    >
                        <VictoryAxis
                            tickLabelComponent={
                                <VictoryLabel
                                    dy={10} //
                                    textAnchor="middle"
                                />
                            }
                            tickValues={totalExpensesByDay.map(item => new Date(item.date_interval))}
                            tickFormat={(t) => {
                                const date = new Date(t);
                                const day = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', timeZone: 'UTC' }).format(date);
                                const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: 'UTC' }).format(date);
                                const month = new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' }).format(date);
                                return `${day}\n${weekday}\n${month}`;
                            }}

                            style={{
                                tickLabels: { fontSize: 16, fill: isDarkMode ? "#c0c0c0" : "#1d1d1d" },
                                grid: { stroke: '#686faa6a', strokeDasharray: '0', strokeWidth: 0.5 },
                                axis: { stroke: "#686faa6a", strokeWidth: 3 },
                            }}
                        />
                        <VictoryAxis
                            tickFormat={(t) => `R$ ${t.toLocaleString('pt-BR')}`}
                            dependentAxis
                            style={{
                                tickLabels: { fontSize: 14, fill: isDarkMode ? "#c0c0c0" : "#000000" },
                                grid: { stroke: '#686faa6a', strokeDasharray: '0', strokeWidth: 0.5 },
                                axis: { stroke: "transparent" },
                            }}
                        />
                        <VictoryLine
                            data={totalExpensesByDay}
                            interpolation={'monotoneX'}
                            x="date_interval"
                            y="valor"

                            style={{
                                data: { stroke: "#be372e", strokeWidth: 5 },
                            }}
                        // animate={{ duration: 1000, easing: 'linear' }}
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
        marginTop: 24,
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
        minHeight: 430,
    },
});
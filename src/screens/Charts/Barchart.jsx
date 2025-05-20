import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import React, { useContext, useMemo, useState } from 'react'
import { colorContext } from '@context/colorScheme';
import { useTransactionSummary } from '@hooks/useTransactionSummary';
import { startOfMonth } from 'date-fns/startOfMonth';
import BarChartComponent from '@components/barChartComponent';
import DateButtonNavigation from '@components/dateButtonNavigation';
import { startOfDay, subDays, subMonths, addDays, addMonths } from 'date-fns';


export default function Barchart() {
    const { isDarkMode } = useContext(colorContext)
    const [lastDate, setLastDate] = useState(startOfDay(new Date()))
    const [firstDate, setFirstDate] = useState(startOfMonth(new Date()))

    const { data, isLoading } = useTransactionSummary({
        first_day: firstDate,
        last_day: lastDate,
        period: 'week'
    });


    const groupedData = data?.reduce((acc, item) => {
        const week = `S${item.name_interval}`;
        const tipo = item.tipo;
        const valor = parseFloat(item.valor);
        if (!acc[week]) {
            acc[week] = { despesa: 0, receita: 0, date_interval: item.date_interval };
        }
        acc[week][tipo] += valor;

        return acc;
    }, {});

    const chartData = groupedData
        ? Object.entries(groupedData)?.map(([week, values]) => ({
            week,
            date_interval: new Date(values.date_interval).toISOString(),
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
            setFirstDate(prev => subMonths(prev, 1))
            setLastDate(prev => subMonths(prev, 1))
            console.log(firstDate, lastDate)
        }
        if (label === 'next') {
            setFirstDate(prev => addMonths(prev, 1))
            setLastDate(prev => addMonths(prev, 1))
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
                    <BarChartComponent
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
        borderWidth: 2,
        height: 420,
    }
});
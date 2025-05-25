import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import React, { useContext, useMemo, useState } from 'react'
import { colorContext } from '@context/colorScheme';
import { useTransactionSummary } from '@hooks/useTransactionSummary';
import { startOfMonth } from 'date-fns/startOfMonth';
import BarChartComponent from '@components/barChartComponent';
import DateButtonNavigation from '@components/dateButtonNavigation';
import { subMonths, startOfWeek, endOfWeek, addMonths, endOfMonth } from 'date-fns';


export default function Barchart() {
    const { isDarkMode } = useContext(colorContext)
    const [firstDate, setFirstDate] = useState(() => {
        const date = startOfMonth(new Date())
        date.setHours(0, 0, 0, 0)
        return date
    })
    const [lastDate, setLastDate] = useState(() => {
        const date = endOfMonth(new Date())
        date.setHours(23, 59, 59, 999)
        return date
    })

    const { data: barChartData, isLoading } = useTransactionSummary({
        first_day: firstDate,
        last_day: lastDate,
        period: 'week'
    });

    const totalSemana = barChartData?.data.reduce((acc, item) => {
        acc.despesa += item.despesa
        acc.receita += item.receita
        return acc
    }, { despesa: 0, receita: 0 })

    // console.log(totalSemana)

    let porcentagem_despesa

    if (barChartData?.percent.despesa > 0 && isFinite(barChartData?.percent.despesa)) {
        porcentagem_despesa = <Text style={styles.percentUp}> +({Math.abs(barChartData?.percent.despesa)})%</Text>
    }
    if (barChartData?.percent.despesa < 0) {
        porcentagem_despesa = <Text style={styles.percentDown}> -({Math.abs(barChartData?.percent.despesa)})%</Text>
    }

    let porcentagem_receita
    if (barChartData?.percent.receita > 0 && isFinite(barChartData?.percent.receita)) {
        porcentagem_receita = <Text style={styles.percentUp}> +({Math.abs(barChartData?.percent.receita)})%</Text>
    }
    if (barChartData?.percent.receita < 0) {
        porcentagem_receita = <Text style={styles.percentDown}> -({Math.abs(barChartData?.percent.receita)})%</Text>
    }


    const handleDate = (label) => {
        if (label === 'prev') {
            setFirstDate(prev => subMonths(prev, 1))
            setLastDate(prev => subMonths(prev, 1))
        }
        if (label === 'next') {
            setFirstDate(prev => addMonths(prev, 1))
            setLastDate(prev => addMonths(prev, 1))
        }
    }

    return (
        <ScrollView contentContainerStyle={{ gap: 16, marginTop: 16 }} style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
            <View style={{ alignSelf: 'center', marginTop: 24 }}>
                <Text style={[styles.legend, { color: isDarkMode ? '#ddd' : '#111' }]}>
                    Total Despesas:
                    <Text style={{ fontWeight: 'bold' }}>
                        {totalSemana?.despesa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        {porcentagem_despesa}
                    </Text>
                </Text>
                <Text style={[styles.legend, { color: isDarkMode ? '#ddd' : '#111' }]}>
                    Total Receitas:
                    <Text style={{ fontWeight: 'bold' }}>
                        {totalSemana?.receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        {porcentagem_receita}
                    </Text>
                </Text>
            </View>
            <View style={[styles.chart, { backgroundColor: isDarkMode ? '#222' : '#fffefe', borderColor: isDarkMode ? '#444' : '#ccc', }]}>
                <Text style={[styles.title, { color: isDarkMode ? '#ddd' : '#111' }]}>
                    Receita x despesas por semana
                </Text>
                {barChartData?.data && (
                    <BarChartComponent
                        color={isDarkMode}
                        data={barChartData.data}
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
    },
    percentDown: {
        fontSize: 14,
        fontWeight: '500',
        color: 'red'
    },
    percentUp: {
        fontSize: 14,
        fontWeight: '500',
        color: 'green'
    },
});
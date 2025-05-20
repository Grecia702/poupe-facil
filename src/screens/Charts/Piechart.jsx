import { StyleSheet, View, FlatList, TouchableOpacity, Text, ScrollView } from 'react-native';
import React, { useContext, useMemo, useState } from 'react'
import { subMonths, addMonths, startOfMonth, endOfMonth, format, set } from 'date-fns'
import { colorContext } from '@context/colorScheme';
import { categoriaCores } from '@utils/categoriasCores';
import PieChart from '@components/pieChart';
import Card from '@components/card';
import DateButtonNavigation from '@components/dateButtonNavigation';
import { useDonutchartData } from '@hooks/useDonutchartData';

// TODO: Event Handler que ao clicar no grafico redirecione para a pagina de transações com a categoria filtrada 

export default function Piechart() {
    const { isDarkMode } = useContext(colorContext)
    const [firstDate, setFirstDate] = useState(
        set(startOfMonth(new Date()), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
    )

    const [lastDate, setLastDate] = useState(
        set(endOfMonth(new Date()), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
    )
    const { data, isLoading } = useDonutchartData({
        first_date: firstDate,
        last_date: lastDate
    })
    const [selectedItem, setSelectedItem] = useState(null);



    const handleSelectItem = (label) => {
        setSelectedItem(() => label);
    };

    const total = data?.reduce((acc, item) => {
        acc += item.total
        return acc
    }, 0)

    console.log(firstDate, lastDate)

    const handleDate = (label) => {
        if (label === 'prev') {
            setFirstDate(prev => subMonths(prev, 1))
            setLastDate(prev => set(endOfMonth(subMonths(prev, 1)), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }))
        }
        if (label === 'next') {
            setFirstDate(prev => addMonths(prev, 1))
            setLastDate(prev => set(endOfMonth(addMonths(prev, 1)), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }))

        }
    }

    return (
        <ScrollView contentContainerStyle={{ gap: 16, marginTop: 16 }} style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
            <View style={[styles.chart, { backgroundColor: isDarkMode ? '#222' : '#fffefe' }]}>
                <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>Transações por categorias</Text>
                <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>Periodo: {format(firstDate, 'MM-yyyy')}</Text>
                {!isLoading && (
                    <PieChart
                        height={350}
                        width={350}
                        padAngle={3}
                        data={data}
                        total={total}
                        selected={selectedItem}
                    />
                )
                }
            </View>
            <DateButtonNavigation
                prevAction={() => handleDate('prev')}
                nextAction={() => handleDate('next')}
            />
            <FlatList
                data={data}
                keyExtractor={(item) => item.categoria}
                scrollEnabled={false}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={5}
                renderItem={({ item }) => (
                    <Card
                        color={categoriaCores[item.categoria]}
                        title={item.categoria}
                        text={(item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))}
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
        borderColor: '#ccc',
        height: 420,
    },
});
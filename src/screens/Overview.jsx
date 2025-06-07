import { StyleSheet, Text, View, FlatList, ScrollView, Image } from 'react-native'
import React, { useContext, useMemo, useState } from 'react'
import { colorContext } from '@context/colorScheme';
import { VictoryPie, VictoryTooltip, Flyout } from 'victory-native'
import { useReports } from '@hooks/useReports'
import Card from '@components/card';
import { categoriaCores } from '@utils/categoriasCores'
import { format, subMonths, addMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import DateButtonNavigation from '@components/dateButtonNavigation';
const NoData = require('@assets/no_data.png')

const Overview = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const { isDarkMode } = useContext(colorContext)
    const [date, setDate] = useState(subMonths(new Date(), 1))
    const lastReportPeriod = useMemo(() => {
        return date
    }, [date])
    const { data: reportData } = useReports({ period: lastReportPeriod })
    const data = useMemo(() => {
        const categorias = reportData?.quantia_gasta_categorias
        if (categorias && Object.keys(categorias).length > 0) {
            return Object.entries(categorias).map(([categoria, valor]) => ({
                x: categoria,
                y: valor
            }))
        }
        return []
    }, [reportData])
    const handleSelectItem = (label) => {
        setSelectedItem(label);
    };

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 48, justifyContent: 'center' }} style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f7f7f8' }]}>

            <View style={[styles.dateLabel, { backgroundColor: isDarkMode ? '#333' : '#ddd', }]}>
                <Text style={{ fontSize: 18, fontWeight: 500, color: isDarkMode ? '#ccc' : '#333' }}>
                    Relatório de {format(date, 'MMMM', { locale: ptBR })}
                </Text>
            </View>
            {reportData ? (
                <>
                    <View style={styles.wrapper}>
                        <View style={styles.titleContainer}>
                            <Text style={[styles.text, { color: isDarkMode ? '#ddd' : '#111' }]}>
                                Orçamento Total
                            </Text>
                            <Text style={[styles.text, { color: isDarkMode ? '#ddd' : '#111' }]}>
                                {(reportData?.limite_total || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </Text>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={[styles.text, { color: isDarkMode ? '#ddd' : '#111' }]}>
                                Gasto Total
                            </Text>
                            <Text style={[styles.text, { color: isDarkMode ? '#ddd' : '#111' }]}>
                                {(reportData?.quantia_gasta || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </Text>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={[styles.text, { color: isDarkMode ? '#ddd' : '#111' }]}>
                                Saldo Restante
                            </Text>
                            <Text style={[styles.text, { color: reportData?.status === 'DENTRO_DO_ORCAMENTO' ? (isDarkMode ? '#27c241' : '#218b1d') : (isDarkMode ? '#e04848' : '#d62020') }]}>
                                {((reportData?.limite_total - reportData?.quantia_gasta) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </Text>
                        </View>
                    </View>
                    <View style={{ alignSelf: 'center' }}>
                        <VictoryPie
                            data={data}
                            height={220}
                            width={220}
                            colorScale={data?.map(item => categoriaCores[item.x])}
                            style={{
                                labels: { fontSize: 16, fill: "black" }
                            }}
                            labels={({ datum }) => `Porcentagem: ${((datum.y / reportData.limite_total) * 100).toFixed(2)}%`}
                            labelComponent={
                                <VictoryTooltip renderInPortal={false}
                                    active={({ datum }) => datum.x === selectedItem ? true : false}
                                    flyoutPadding={{ top: 5, bottom: 5, left: 20, right: 20 }}
                                    flyoutStyle={{
                                        fill: isDarkMode ? '#252525' : "#fff",
                                        stroke: "#9e9b9b",
                                        strokeWidth: 1,
                                        shadowColor: "#000",
                                    }}
                                    flyoutComponent={
                                        <Flyout cornerRadius={5} pointerLength={3}
                                        />}
                                    style={{ fill: isDarkMode ? "#c5c6c7" : '#3b3b3b', fontSize: 16, fontWeight: 500 }}
                                />
                            }
                        />
                    </View>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.x.toString()}
                        scrollEnabled={false}
                        initialNumToRender={10}
                        maxToRenderPerBatch={5}
                        windowSize={5}
                        renderItem={({ item }) => (
                            <Card
                                color={categoriaCores[item.x]}
                                title={item.x}
                                text={(item.y).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                selectedItem={selectedItem}
                                selected={selectedItem === item.x ? selectedItem : 'none'}
                                onPress={() => handleSelectItem(item.x)}
                            />
                        )}
                    />
                    <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#333' : '#fff', borderColor: isDarkMode ? '#444' : '#ccc' }]}>

                        <Text style={[{ fontSize: 16, textAlign: 'justify', color: isDarkMode ? '#ddd' : '#111' }]}>
                            {reportData?.recomendacoes}
                        </Text>
                    </View>
                </>
            ) : (
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 500, paddingBottom: 64 }}>
                    <Image source={NoData} style={{ width: 250, height: 250 }} />
                    <Text style={{ fontSize: 18, fontWeight: '500', color: isDarkMode ? '#a1a1a1' : '#555' }}> Nada por aqui...</Text>
                </View>
            )}
            <DateButtonNavigation
                prevAction={() => setDate(subMonths(date, 1))}
                nextAction={() => setDate(addMonths(date, 1))}
            />
        </ScrollView >
    )
}

export default Overview

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#eff8fa',

    },
    dateLabel: {
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 18,
        marginBottom: 24,
    },
    wrapper: {
        gap: 16,
    },
    titleContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    text: {
        fontSize: 18,
        fontWeight: 500,
    },
    inputContainer: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginTop: 16,
        marginBottom: 24
    }
})
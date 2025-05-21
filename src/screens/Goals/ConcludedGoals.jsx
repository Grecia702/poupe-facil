import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import { useContext, useState } from 'react'
import { colorContext } from '@context/colorScheme';
import { useGoals } from '@hooks/useGoals';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Goals from '@components/goals';
import { Provider } from 'react-native-paper';

const ConcludedGoals = () => {
    const { isDarkMode } = useContext(colorContext)
    const { data: goalsData } = useGoals({ total: true, status_meta: 'concluida' })
    const [visible, setVisible] = useState(false)
    return (
        <Provider>
            <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f7f7f8' }]}>
                {goalsData?.metas.length > 0 ?
                    (
                        <>
                            <View style={styles.cardCarrousel}>
                                <View style={styles.card}>
                                    <View style={{ flexDirection: 'row', gap: 4 }}>
                                        <MaterialIcons name="savings" size={24} color="#333" />
                                        <Text style={styles.cardText}>
                                            Metas Alcançadas
                                        </Text>
                                    </View>
                                    <Text style={[styles.cardTextHighlight, { textAlign: 'right' }]}>
                                        {goalsData?.total.total_ocorrencias || 0}
                                    </Text>
                                </View>
                                <View style={styles.card}>
                                    <View style={{ flexDirection: 'row', gap: 4 }}>
                                        <MaterialIcons name="flag" size={24} color="#333" />
                                        <Text style={styles.cardText}>
                                            Total em Metas
                                        </Text>
                                    </View>
                                    <Text style={styles.cardTextHighlight}>
                                        {(goalsData?.total.total_economizado || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Text>
                                </View>
                            </View>
                            <FlatList
                                keyExtractor={(item) => item.id.toString()}
                                data={goalsData?.metas}
                                renderItem={({ item }) => (
                                    <View style={styles.goalContainer}>
                                        <Goals
                                            goal_desc={item?.desc_meta}
                                            current_amount={item?.saldo_meta}
                                            total_amount={item?.valor_meta}
                                            start_date={item?.data_inicio}
                                            end_date={item?.deadline}
                                            showOptions={true}
                                            visible={visible}
                                            status_meta={'concluida'}
                                            setVisible={setVisible}
                                            deleteButton={() => console.log('hello')}
                                        />
                                    </View>
                                )}
                            />
                        </>
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 150 }}>
                            <Image
                                source={require('../../assets/no_data.png')}
                                style={{ width: 250, height: 250 }}
                            />
                            <Text style={{ fontSize: 18, fontWeight: '500', color: isDarkMode ? '#a1a1a1' : '#555' }}> Nada por aqui...</Text>
                        </View>
                    )
                }
                <TouchableOpacity style={styles.buttonAdd}>
                    <MaterialIcons name="add-circle" size={64} color="#3B82F6" />
                </TouchableOpacity>
            </View>
        </Provider>
    )
}

export default ConcludedGoals

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#555',
        padding: 16,
        flex: 1,
        width: '100%',
        flexDirection: 'column',
    },
    cardCarrousel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#fff',
        height: 100,
        maxWidth: 220,
        alignSelf: 'center',
        justifyContent: 'center',
        elevation: 1,
        height: 100,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc'
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
    goalContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 25,
        marginTop: 24,
        gap: 24,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    buttonAdd: {
        alignSelf: 'center',
        borderRadius: 50,
        position: 'absolute',
        bottom: 20,
        right: 20
    }
})
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native'
import { useContext, useState } from 'react'
import { colorContext } from '@context/colorScheme';
import { useGoals } from '@hooks/useGoals';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Goals from '@components/goals';
import { Provider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ActiveGoals = () => {
    const { isDarkMode } = useContext(colorContext)
    const { data: goalsData } = useGoals()
    const [visible, setVisible] = useState(false)
    const navigation = useNavigation();

    return (
        <Provider>
            <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f7f7f8' }]}>
                {goalsData?.metas.length > 0 ? (
                    <>
                        <View style={styles.cardCarrousel}>
                            <View style={[styles.card, { backgroundColor: isDarkMode ? '#222' : '#fffefe', borderColor: isDarkMode ? '#333' : '#ccc' }]}>
                                <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>

                                    <Text style={[styles.cardText, { color: isDarkMode ? '#aaa' : '#4d5e6f' }]}>
                                        Total Alcançado
                                    </Text>
                                    <MaterialIcons name="savings" size={24} color={isDarkMode ? '#aaa' : '#4d5e6f'} />
                                </View>
                                <Text style={[styles.cardTextHighlight, { color: isDarkMode ? '#ccc' : '#101f31' }]}>
                                    {goalsData.total.total_economizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </Text>
                            </View>
                            <View style={[styles.card, { backgroundColor: isDarkMode ? '#222' : '#fffefe', borderColor: isDarkMode ? '#333' : '#ccc' }]}>
                                <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>

                                    <Text style={[styles.cardText, { color: isDarkMode ? '#aaa' : '#4d5e6f' }]}>
                                        Total em Metas
                                    </Text>
                                    <MaterialIcons name="flag" size={24} color={isDarkMode ? '#aaa' : '#4d5e6f'} />
                                </View>
                                <Text style={[styles.cardTextHighlight, { color: isDarkMode ? '#ccc' : '#101f31' }]}>
                                    {goalsData.total.total_metas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </Text>
                            </View>
                        </View>
                        <FlatList
                            keyExtractor={(item) => item.id.toString()}
                            data={goalsData?.metas}
                            renderItem={({ item }) => (
                                <View style={[styles.goalContainer, { backgroundColor: isDarkMode ? '#222' : '#fffefe', borderColor: isDarkMode ? '#333' : '#ccc' }]}>
                                    <Goals
                                        goal_desc={item?.desc_meta}
                                        current_amount={item?.saldo_meta}
                                        total_amount={item?.valor_meta}
                                        start_date={item?.data_inicio}
                                        end_date={item?.deadline}
                                        showOptions={true}
                                        visible={visible}
                                        status_meta={'andamento'}
                                        setVisible={setVisible}
                                        deleteButton={() => console.log('hello')}
                                    />
                                </View>
                            )}
                        />
                    </>
                ) : (
                    <Image
                        source={require('../../assets/no_data.png')}
                        style={{ width: 100, height: 100 }}
                    />
                )}
                <TouchableOpacity onPress={() => navigation.navigate('Create Goal')} style={styles.buttonAdd}>
                    <MaterialIcons name="add-circle" size={64} color="#3B82F6" />
                </TouchableOpacity>
            </View>
        </Provider>
    )
}

export default ActiveGoals

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
        marginVertical: 8
    },
    card: {
        backgroundColor: '#fff',
        height: 100,
        width: 170,
        alignSelf: 'center',
        justifyContent: 'center',
        elevation: 1,
        height: 100,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,

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
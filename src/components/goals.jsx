import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colorContext } from '@context/colorScheme';
import { useContext, useState } from 'react'
import CustomProgressBar from '@components/customProgressBar'
import { differenceInDays } from 'date-fns';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Menu } from 'react-native-paper';

const Goals = ({ goal_desc, start_date, end_date, current_amount, status_meta, total_amount, showOptions, isVisible, setVisibleId, id, editButton, deleteButton }) => {
    const { isDarkMode } = useContext(colorContext)
    const progress = current_amount / total_amount
    const valor_gasto = current_amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    const valor_total = total_amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    const deadline = differenceInDays(end_date, new Date())
    let color = '#A0A0A0';
    let unfilledColor = '#E0E0E0';

    if (status_meta === 'parado') {
        if (isDarkMode) {
            color = '#504f4f'
            unfilledColor = '#7e7e7e'
        } else {
            color = '#A0A0A0'
            unfilledColor = '#E0E0E0'
        }
    }
    if (status_meta === 'andamento') {
        if (isDarkMode) {
            color = '#034fa1'
            unfilledColor = '#486b92'
        } else {
            color = '#007BFF'
            unfilledColor = '#B3D7FF'
        }
    }
    if (status_meta === 'concluido') {
        color = '#81C784'
        unfilledColor = '#D6EDD9'
    }

    const handleToggleDropdown = () => {
        setVisibleId(isVisible ? null : id);
    };

    return (

        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'flex-start', width: '100%' }}>
                <Text style={[styles.title, { color: isDarkMode ? '#cdcecd' : "#303030" }]}>
                    {goal_desc.charAt(0).toUpperCase() + goal_desc.slice(1)}
                </Text>
                {showOptions && (
                    <Menu
                        visible={isVisible}
                        onDismiss={handleToggleDropdown}
                        anchor={

                            <TouchableOpacity onPress={handleToggleDropdown} style={{ marginRight: -13, margin: 0, padding: 0 }}>
                                <MaterialIcons name="more-vert" size={24} color={isDarkMode ? '#cdcecd' : "#303030"} />
                            </TouchableOpacity>
                        }
                        style={{ marginTop: -80, marginLeft: -10 }}
                    >
                        <Menu.Item onPress={editButton} title="Editar" />
                        <Menu.Item onPress={deleteButton} title="Excluir" />
                        <Menu.Item onPress={() => console.log('Arquivar')} title="Arquivar" />
                    </Menu>
                )}
            </View>
            <View>
                <CustomProgressBar
                    height={25}
                    width={350}
                    color={color}
                    unfilledColor={unfilledColor}
                    progress={progress}
                />
                <Text style={styles.percent}>
                    {Math.round(progress * 100)}%
                </Text>
            </View>
            <Text style={[styles.desc, { color: isDarkMode ? '#cdcecd' : "#303030" }]}>{valor_gasto} de {valor_total}</Text>
            {(status_meta != 'concluido' || status_meta != 'expirada') && (
                <Text style={[styles.title, { marginTop: 16, color: isDarkMode ? '#cdcecd' : "#303030" }]}>
                    Restam: {deadline} dias
                </Text>
            )
            }
        </View>

    )
}

export default Goals

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        alignSelf: 'center',
        padding: 8,
        position: 'relative'
    },
    title: {
        alignSelf: 'flex-start',
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 16
    },
    percent: {
        position: 'absolute',
        color: '#111812',
        right: 10,
        top: 2,
        fontWeight: 'bold'
    },
    desc: {
        alignSelf: 'flex-start',
        marginTop: 12,
    },
})
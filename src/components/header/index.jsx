import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
import { colorContext } from '@context/colorScheme';
import { useNavigation } from '@react-navigation/native';

export default function VisaoGeral({ children, saldo, balanco_geral, despesa, receita }) {
    const navigation = useNavigation();
    const { isDarkMode } = useContext(colorContext)

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? "#2c2c2c" : "#22C55E" }]}>
            {children}
            <Text style={[styles.title, { marginTop: 4 }]}>
                Saldo Total: {(saldo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
            <Text style={[styles.title, { fontSize: 18, fontWeight: '500' }]}>
                Balanço Geral: {(balanco_geral).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                <View
                    style={[styles.widget, { backgroundColor: isDarkMode ? "#2c2c2c" : "#F0FDF4", borderColor: isDarkMode ? "#e9dfdf" : "#F0FDF4" }]}
                    onPress={() => navigation.navigate('Transactions', { params: "receita" })}
                >
                    <View style={[styles.viewIcon, { borderColor: "#61d4b0" }]}>
                        <MaterialIcons name="arrow-upward" size={24} color="#61d4b0" />
                    </View>
                    <Text style={[styles.textInfo, { color: isDarkMode ? "white" : "#1E293B" }]}>
                        Receitas
                    </Text>
                    <Text style={[styles.textInfo, { fontWeight: '700', fontSize: 18, color: isDarkMode ? "white" : "#1E293B" }]}>
                        {`${receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                    </Text>
                </View>
                <View
                    style={[styles.widget, { backgroundColor: isDarkMode ? "#2c2c2c" : "#F0FDF4", borderColor: isDarkMode ? "#e9dfdf" : "#F0FDF4" }]}
                    onPress={() => navigation.navigate('Transactions', { params: "despesa" })}
                >
                    <View style={[styles.viewIcon, { borderColor: "#F87171" }]} >
                        <MaterialIcons name="arrow-downward" size={24} color="#F87171" />
                    </View>
                    <Text style={[styles.textInfo, { color: isDarkMode ? "white" : "#1E293B" }]}>
                        Despesas
                    </Text>
                    <Text style={[styles.textInfo, { fontWeight: '700', fontSize: 18, color: isDarkMode ? "white" : "#1E293B" }]}>
                        {`${despesa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flexDirection: 'column',
        justifyContent: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        gap: 8
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center'
    },
    widget: {
        width: 150,
        maxWidth: 180,
        borderWidth: 2,
        borderRadius: 15,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
    },
    viewIcon: {
        width: 32,
        height: 32,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 10,
    },
    textInfo: {
        fontWeight: '500',
        fontSize: 16,
    },
})
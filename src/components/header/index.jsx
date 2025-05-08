import React, { useContext } from 'react'
import { Header, Widget, TextInfo, ExpenseInfo, ViewIcon, Title } from "./styles";
import { MaterialIcons } from '@expo/vector-icons'
import { colorContext } from '@context/colorScheme';
import { useNavigation } from '@react-navigation/native';

export default function VisaoGeral({ saldo, receitas, despesas }) {
    const navigation = useNavigation();
    const { isDarkMode } = useContext(colorContext)
    return (
        <Header color={isDarkMode ? "#2c2c2c" : "#22C55E"}>
            <Title>Saldo total: R${saldo}</Title>
            <Widget
                onPress={() => navigation.navigate('Transactions', { params: "receita" })}
                color={isDarkMode ? "#2c2c2c" : "#F0FDF4"}
                border={isDarkMode ? "#e9dfdf" : "#F0FDF4"}>
                <ViewIcon color={"#61d4b0"}>
                    <MaterialIcons name="arrow-upward" size={24} color="#61d4b0" />
                </ViewIcon>
                <TextInfo fontWeight={500} size={16} color={isDarkMode ? "white" : "#1E293B"}>Receitas</TextInfo>
                <TextInfo fontWeight={700} size={20} color={isDarkMode ? "white" : "#1E293B"}>{`R$${Number(receitas).toFixed(2)}`}</TextInfo>
            </Widget>
            <Widget
                onPress={() => navigation.navigate('Transactions', { params: "despesa" })}
                color={isDarkMode ? "#2c2c2c" : "#F0FDF4"}
                border={isDarkMode ? "#e9dfdf" : "#F0FDF4"}>
                <ViewIcon color={"#F87171"} >
                    <MaterialIcons name="arrow-downward" size={24} color="#F87171" />
                </ViewIcon>
                <TextInfo fontWeight={500} size={16} color={isDarkMode ? "white" : "#1E293B"}>Despesas</TextInfo>
                <TextInfo fontWeight={700} size={20} color={isDarkMode ? "white" : "#1E293B"}>{`R$${Number(despesas).toFixed(2)}`}</TextInfo>
            </Widget>
        </Header>
    )
}
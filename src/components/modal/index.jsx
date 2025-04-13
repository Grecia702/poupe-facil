import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { Modal, ViewModal, TouchableOpacity, TextModal, Categoria, Text, Filtro, List, Title, TextInput, SearchButton, Tag } from "./styles";

export default function ModalView({ onPress, color }) {

    const data = [
        { id: '1', categoria: 'Contas', color: 'rgb(46, 124, 57)' },
        { id: '2', categoria: 'Lazer', color: 'rgb(202, 206, 5)' },
        { id: '3', categoria: 'Educação', color: 'rgb(161, 41, 41)' },
        { id: '4', categoria: 'Segurança', color: 'rgb(55, 49, 136)' },
        { id: '5', categoria: 'Transporte', color: 'rgb(202, 160, 42)' },
    ]

    const ficticionalArr = [
        {
            "transaction_id": 36,
            "conta": "Conta Poupança Banco A",
            "categoria": "Alimentação",
            "tipo": "Receita",
            "valor": 564.07,
            "data_compra": "2024-11-19T12:47:26.000Z"
        },
        {
            "transaction_id": 37,
            "conta": "Cartão de Crédito Banco A",
            "categoria": "Educação",
            "tipo": "Receita",
            "valor": 993.17,
            "data_compra": "2025-03-27T13:12:38.000Z"
        },
        {
            "transaction_id": 38,
            "conta": "Conta Investimentos Banco A",
            "categoria": "Contas",
            "tipo": "Receita",
            "valor": 774.62,
            "data_compra": "2024-09-21T14:20:14.000Z"
        },
        {
            "transaction_id": 39,
            "conta": "Conta Investimentos Banco A",
            "categoria": "Compras",
            "tipo": "Receita",
            "valor": 748.56,
            "data_compra": "2024-12-31T15:35:02.000Z"
        },
        {
            "transaction_id": 40,
            "conta": "Conta Salário Banco A",
            "categoria": "Compras",
            "tipo": "Despesa",
            "valor": -615.24,
            "data_compra": "2024-07-16T16:47:50.000Z"
        },
        {
            "transaction_id": 41,
            "conta": "Conta Poupança Banco A",
            "categoria": "Compras",
            "tipo": "Despesa",
            "valor": -68.10,
            "data_compra": "2024-05-08T17:52:22.000Z"
        },
        {
            "transaction_id": 42,
            "conta": "Conta Corrente Banco A",
            "categoria": "Lazer",
            "tipo": "Despesa",
            "valor": -582.51,
            "data_compra": "2025-01-29T18:03:47.000Z"
        },
        {
            "transaction_id": 43,
            "conta": "Conta Corrente Banco A",
            "categoria": "Educação",
            "tipo": "Receita",
            "valor": 809.65,
            "data_compra": "2024-12-02T19:27:33.000Z"
        },
        {
            "transaction_id": 44,
            "conta": "Conta Poupança Banco A",
            "categoria": "Educação",
            "tipo": "Despesa",
            "valor": -624.19,
            "data_compra": "2024-11-26T20:18:56.000Z"
        },
        {
            "transaction_id": 45,
            "conta": "Conta Salário Banco A",
            "categoria": "Outros",
            "tipo": "Despesa",
            "valor": -631.14,
            "data_compra": "2024-12-09T21:05:10.000Z"
        }
    ]

    const [valor, setValor] = useState('');
    const [date, setDate] = useState('');
    // const [categorias, setCategorias] = useState('');
    // const [selected, setSelected] = useState(null);

    // const [filters, setFilters] = useState(true);
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);



    const toggleCategoria = (categoria) => {
        if (categoriasSelecionadas.includes(categoria)) {
            setCategoriasSelecionadas(prev =>
                prev.filter(item => item !== categoria)
            );
        } else {
            setCategoriasSelecionadas(prev => [...prev, categoria]);
        }
    };

    function makeFilter(valor, date, categoria) {
        const filtros = [];

        if (date !== '') filtros.push("Data");
        if (valor !== '') filtros.push("Valor");
        if (categoria !== '') filtros.push(`${categoria}`);

        console.log("Filtros ativos:", filtros);
    }

    // function filtraDados(valor, date) {
    //     const filtered = ficticionalArr.filter(item => (item.valor > valor && (item.data_compra).split('T')[0] < date)
    //     )
    //     filtered.map((item) => {
    //         console.log("Transação: ", item.transaction_id, " Valor: ", item.valor, " data: ", item.data_compra.split('T')[0])
    //     })
    // }

    return (
        <Modal>
            <ViewModal>
                <TouchableOpacity onPress={onPress}>
                    <TextModal>X</TextModal>
                </TouchableOpacity>
                <Title>Valor</Title>
                <TextInput placeholder="Valor" keyboardType="numeric" value={valor}
                    onChangeText={(texto) => {
                        setValor(texto)
                    }}
                />

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                    <TouchableOpacity color={'#ccc9c9'}>
                        <Text>{'<'} Menor que</Text>
                    </TouchableOpacity>
                    <TouchableOpacity color={'#ccc9c9'}>
                        <Text>{'='} Igual a</Text>
                    </TouchableOpacity>
                    <TouchableOpacity color={'#ccc9c9'}>
                        <Text>{'>'} Maior que</Text>
                    </TouchableOpacity>
                </View>
                <Title>Data</Title>

                <Calendar
                    onDayPress={day => {
                        setDate(day.dateString);
                    }}
                    markedDates={{
                        [date]: { date: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                    }}
                />
                <Title>Categorias</Title>
                <List
                    data={data}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <Filtro
                            color={item.color}
                            onPress={() => {
                                toggleCategoria(item.categoria)
                            }}
                            selected={categoriasSelecionadas.includes(item.categoria)}
                        >
                            <Tag color={item.color} />
                            <Categoria selected={categoriasSelecionadas.includes(item.categoria)}>{item.categoria}</Categoria>
                        </Filtro>
                    )}
                    contentContainerStyle={{
                        marginTop: 10,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: 15,
                    }}
                />
                <SearchButton color={'green'} onPress={() => makeFilter(valor, date, categoriasSelecionadas)}>
                    <TextModal>Buscar</TextModal>
                </SearchButton>
            </ViewModal>
        </Modal>
    )
}
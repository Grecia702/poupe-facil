import React, { useState, useContext, useMemo, useCallback, useEffect } from "react";
import { View } from "react-native";
import { Calendar } from 'react-native-calendars';
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import {
    Modal, ViewModal, TouchableOpacity, TextModal,
    Categoria, Text, Filtro, List, Title, TextInput,
    SearchButton, Tag, ActiveFilters, ActiveText
} from "./styles";

// TODO: Adicionar mais opções de filtragem, refatorar e otimizar

export default function ModalView({ setModalVisible, setTesteFiltros }) {
    const data = [
        { id: '1', categoria: 'Contas', color: 'rgb(46, 124, 57)' },
        { id: '2', categoria: 'Lazer', color: 'rgb(202, 206, 5)' },
        { id: '3', categoria: 'Educação', color: 'rgb(48, 174, 212)' },
        { id: '4', categoria: 'Segurança', color: 'rgb(55, 49, 136)' },
        { id: '5', categoria: 'Transporte', color: 'rgb(202, 160, 42)' },
        { id: '6', categoria: 'Alimentação', color: 'rgb(124, 29, 29)' },
        { id: '7', categoria: 'Compras', color: 'rgb(22, 230, 91)' },
    ]

    const [valor, setValor] = useState(null);
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
    const [operator, setOperator] = useState(null)
    const [date, setDate] = useState(null);
    const [filtros, setFiltros] = useState([])
    const toggleOperator = useCallback((symbol) => {
        if (operator === symbol) {
            setOperator(null);
            setFiltros(prev => prev.filter(item => item !== symbol));
        } else {
            setOperator(symbol);
            setFiltros(prev => {
                const updated = prev.filter(item => item !== 'Lesser' && item !== 'Greater');
                return [...updated, symbol];
            });
        }
    }, [operator, setOperator, setFiltros]);

    const toggleCategoria = useCallback((categoria) => {
        setCategoriasSelecionadas(prev => {
            if (prev.includes(categoria)) {
                return prev.filter(item => item !== categoria);
            } else {
                return [...prev, categoria];
            }
        });
    }, []);

    const toggleFilters = useCallback((filtrosAtivos) => {
        setFiltros(prev =>
            prev.includes(filtrosAtivos)
                ? prev.filter(item => item !== filtrosAtivos)
                : [...prev, filtrosAtivos]
        );
    }, []);

    const removeItem = (id) => {
        const novaLista = filtros.filter((_, index) => index !== id);
        setFiltros(novaLista);

    }

    const adicionarVariosFiltros = (novosFiltros) => {
        setTesteFiltros(() => (
            Object.entries(novosFiltros).reduce((acc, [chave, valor]) => {
                if (Array.isArray(valor)) {
                    acc[chave] = [...valor];
                } else {
                    acc[chave] = valor;
                }
                return acc;
            }, {})
        ));
        setModalVisible(false)
    };

    // console.log(data.map(item => {
    //     return item.categoria
    // }))
    const FiltrosAtivos = React.memo(({ filtros, removeItem }) => {
        return (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {filtros.map((item, index) => (
                    <ActiveFilters key={index} color={"#1976D2"} onPress={() => removeItem(index)}>
                        <ActiveText color={"white"}>{item.toString()}</ActiveText>
                    </ActiveFilters>
                ))}
            </View>
        );
    });
    // const ListaCategorias = React.memo(({ data, categoriasSelecionadas, toggleCategoria, toggleFilters }) => {

    //     return (
    //         <List
    //             data={data}
    //             keyExtractor={(item) => item.id}
    //             scrollEnabled={false}
    //             renderItem={({ item }) => (
    //                 <Filtro
    //                     color={item.color}
    //                     onPress={() => {
    //                         toggleCategoria(item.categoria);
    //                         toggleFilters(item.categoria);
    //                     }}
    //                     selected={categoriasSelecionadas.includes(item.categoria)}
    //                 >
    //                     <Tag color={item.color} />
    //                     <Categoria selected={categoriasSelecionadas.includes(item.categoria)}>{item.categoria}</Categoria>
    //                 </Filtro>
    //             )}
    //             contentContainerStyle={{
    //                 marginTop: 10,
    //                 flexDirection: 'row',
    //                 flexWrap: 'wrap',
    //                 gap: 15,
    //             }}
    //         />
    //     );
    // });

    const CalendarioFiltro = React.memo(({ date, onSelectDate }) => {
        return (
            <Calendar
                onDayPress={day => {
                    onSelectDate(day.dateString);
                }}
                markedDates={{
                    [date]: {
                        selected: true,
                        disableTouchEvent: false,
                        selectedDotColor: 'orange',
                    }
                }}
            />
        );
    });

    const onSelectDate = useCallback((novaData) => {
        if (novaData === date) return;

        setFiltros(prev => {
            if (prev.includes(novaData)) {
                return prev;
            }
            const semDataAnterior = prev.filter(item => item !== date);
            return [...semDataAnterior, novaData];
        });

        setDate(novaData);
    }, [date, setFiltros, setDate]);

    const handleRemoveItem = useCallback((index) => {
        const novaLista = filtros.filter((_, i) => i !== index);
        setFiltros(novaLista);
    }, [filtros]);


    const MapeiaCategorias = React.memo(({ data, categoriasSelecionadas, toggleCategoria, toggleFilters }) => {
        return (
            <>
                <Title>Categorias</Title>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15 }}>
                    {data.map((item, key) => (
                        <Filtro
                            key={key}
                            color={item.color}
                            onPress={() => {
                                toggleCategoria(item.categoria);
                                toggleFilters(item.categoria);
                            }}
                            selected={categoriasSelecionadas.includes(item.categoria)}
                        >
                            <Tag color={item.color} />
                            <Categoria selected={categoriasSelecionadas.includes(item.categoria)}>
                                {item.categoria}
                            </Categoria>
                        </Filtro>
                    ))}
                </View>
            </>
        )
    })



    return (
        <Modal>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ViewModal>
                    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <TextModal>X</TextModal>
                        </TouchableOpacity>
                        <Title>Filtros Ativos: </Title>
                        <FiltrosAtivos filtros={filtros} removeItem={handleRemoveItem} />
                        <Title>Valor</Title>
                        <TextInput placeholder="Valor" keyboardType="numeric" value={valor}
                            onChangeText={(texto) => setValor(texto)} />
                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                            <TouchableOpacity color={'#1976D2'} onPress={() => toggleOperator("Lesser")} selected={operator === "Lesser"}>
                                <Text color={"white"} selected={operator === "Lesser"}>{'<'} Menor que {'>'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity color={'#1976D2'} onPress={() => toggleOperator("Greater")} selected={operator === "Greater"}>
                                <Text color={"white"} selected={operator === "Greater"}>{'>'} Maior que {'<'}</Text>
                            </TouchableOpacity>
                        </View>

                        <MapeiaCategorias
                            data={data}
                            categoriasSelecionadas={categoriasSelecionadas}
                            toggleCategoria={toggleCategoria}
                            toggleFilters={toggleFilters}
                        />

                        <Title>Data</Title>
                        <CalendarioFiltro date={date} onSelectDate={onSelectDate} />
                        <SearchButton color={'green'} onPress={() => {
                            adicionarVariosFiltros({
                                categorias: categoriasSelecionadas,
                                valor: valor,
                                operador: operator,
                                data: date
                            })
                        }}>
                            <TextModal>Buscar</TextModal>
                        </SearchButton>
                    </ScrollView>
                </ViewModal>
            </KeyboardAvoidingView>
        </Modal>
    );
}
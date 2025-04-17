import React, { useState, useContext, useMemo, useCallback, useEffect } from "react";
import { View } from "react-native";
import { TransactionContext } from "@context/transactionsContext.js";
import { Calendar } from 'react-native-calendars';
import {
    Modal, ViewModal, TouchableOpacity, TextModal,
    Categoria, Text, Filtro, List, Title, TextInput,
    SearchButton, Tag, ActiveFilters, ActiveText
} from "./styles";

export default function ModalView({ onPress, setFiltrosAtivos }) {
    const { dados, setDados } = useContext(TransactionContext);

    const data = [
        { id: '1', categoria: 'Contas', color: 'rgb(46, 124, 57)' },
        { id: '2', categoria: 'Lazer', color: 'rgb(202, 206, 5)' },
        { id: '3', categoria: 'Educação', color: 'rgb(161, 41, 41)' },
        { id: '4', categoria: 'Segurança', color: 'rgb(55, 49, 136)' },
        { id: '5', categoria: 'Transporte', color: 'rgb(202, 160, 42)' },
    ]

    const [valor, setValor] = useState('');
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
    const [operator, setOperator] = useState()
    const [date, setDate] = useState(null);
    const [filtros, setFiltros] = useState([])



    // const toggleCategoria = (categoria) => {
    //     if (categoriasSelecionadas.includes(categoria)) {
    //         setCategoriasSelecionadas(prev =>
    //             prev.filter(item => item !== categoria)
    //         );
    //     } else {
    //         setCategoriasSelecionadas(prev => [...prev, categoria]);
    //     }
    // };

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

    // const toggleOperator = (symbol) => {
    //     if (operator === symbol) {
    //         setOperator(null)
    //         setFiltros(prev => prev.filter(item => item !== symbol));
    //     }
    //     else {
    //         setOperator(symbol)
    //         setFiltros(prev => {
    //             const updated = prev.filter(item => item !== 'Lesser' && item !== 'Greater');
    //             return [...updated, symbol];
    //         });
    //     }
    // }

    // const toggleFilters = (filtrosAtivos) => {
    //     if (filtros.includes(filtrosAtivos)) {
    //         setFiltros(prev =>
    //             prev.filter(item => item !== filtrosAtivos)
    //         );
    //     }
    //     else {
    //         setFiltros(prev => [...prev, filtrosAtivos]);
    //     }
    // };


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

    const makeFilter = useCallback((valor, date, categorias, operator) => {
        const valorNumber = valor !== '' ? parseFloat(valor) : null;
        const filtragem = dados.filter(item => {
            const itemValor = parseFloat(item.valor);
            let matchValor;
            if (valorNumber === null) {
                matchValor = true;
            } else if (operator === 'Lesser') {
                matchValor = itemValor < valorNumber;
            } else {
                matchValor = itemValor > valorNumber;
            }
            const matchDate = date === '' || item.data_compra.startsWith(date);

            const matchCategoria = categorias.length === 0 || categorias.includes(item.categoria);

            return matchValor && matchDate && matchCategoria;
        });
        // console.log("dados são: ", dados)

        setDados(filtragem);
        setFiltrosAtivos(filtros);
        onPress();
        return {
            filtros: { valor, date, categorias, operator },
            filtragem
        };
    }, [dados, filtros, setDados, setFiltrosAtivos, onPress]);


    // console.log("Filtros: ", filtros)

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
    const ListaCategorias = React.memo(({ data, categoriasSelecionadas, toggleCategoria, toggleFilters }) => {
        return (
            <List
                data={data}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <Filtro
                        color={item.color}
                        onPress={() => {
                            toggleCategoria(item.categoria);
                            toggleFilters(item.categoria);
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
        );
    });

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


    return (
        <Modal>
            <ViewModal>
                <TouchableOpacity onPress={onPress}>
                    <TextModal>X</TextModal>
                </TouchableOpacity>
                <Title>Filtros Ativos: </Title>
                <FiltrosAtivos filtros={filtros} removeItem={handleRemoveItem} />
                <Title>Valor</Title>
                <TextInput placeholder="Valor" keyboardType="numeric" value={valor}
                    onChangeText={(texto) => {
                        setValor(texto)
                    }}
                />

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                    <TouchableOpacity color={'#1976D2'} onPress={() => toggleOperator("Lesser")} selected={operator === "Lesser"}>
                        <Text color={"white"} selected={operator === "Lesser"}>{'<'} Menor que {'>'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity color={'#1976D2'} onPress={() => toggleOperator("Greater")} selected={operator === "Greater"}>
                        <Text color={"white"} selected={operator === "Greater"}>{'>'} Maior que {'<'}</Text>
                    </TouchableOpacity>
                </View>
                <Title>Data</Title>

                <CalendarioFiltro date={date} onSelectDate={onSelectDate} />

                <Title>Categorias</Title>
                <ListaCategorias
                    data={data}
                    categoriasSelecionadas={categoriasSelecionadas}
                    toggleCategoria={toggleCategoria}
                    toggleFilters={toggleFilters}
                />
                <SearchButton color={'green'} onPress={() => makeFilter(valor, date, categoriasSelecionadas, operator)}>
                    <TextModal>Buscar</TextModal>
                </SearchButton>
            </ViewModal>
        </Modal>
    )
}
import React from "react";
import { FlatList, View } from "react-native";
import { Modal, ViewModal, TouchableOpacity, TextModal, Categorias, Text, Filtro, List, Title, TextInput } from "./styles";

export default function ModalView({ onPress, color }) {
    const data = [
        { id: '1', categoria: 'contas', color: 'green' },
        { id: '2', categoria: 'lazer', color: 'yellow' },
        { id: '3', categoria: 'educação', color: 'red' },
        { id: '4', categoria: 'segurança', color: 'blue' },
        { id: '5', categoria: 'transporte', color: 'orange' },
    ]

    return (
        <Modal>
            <ViewModal>
                <TouchableOpacity onPress={onPress}>
                    <TextModal>X</TextModal>
                </TouchableOpacity>

                <Title>Valor</Title>
                <TextInput placeholder="Valor" keyboardType="numeric" />

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
                <Title>Categorias</Title>
                <List
                    data={data}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={true}
                    renderItem={({ item }) => (
                        <Filtro color={item.color} onPress={() => console.log(item.color)}>
                            <Text>{item.categoria}</Text>
                        </Filtro>
                    )}
                    contentContainerStyle={{
                        marginTop: 10,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: 15,
                    }}
                />
                <Title>Data</Title>
                <TouchableOpacity color={'green'}>
                    <TextModal>Buscar</TextModal>
                </TouchableOpacity>
            </ViewModal>
        </Modal>
    )
}
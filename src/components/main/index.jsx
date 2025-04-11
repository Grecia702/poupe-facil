import { Text } from 'react-native'
import React from "react";
import { Picker } from '@react-native-picker/picker';

import { Container, Title, TextParagraph } from "./styles";


export default function Index({ }) {
    const [categoria, setCategoria] = useState("alimentacao");

    return (
        <Container>
            <Title>Categorias</Title>
            <TextParagraph>Selecione uma categoria: {categoria}</TextParagraph>
            <Picker
                selectedValue={categoria}
                onValueChange={(itemValue) => setCategoria(itemValue)}
            >
                <Picker.Item label="Alimentação" value="alimentacao" />
                <Picker.Item label="Transporte" value="transporte" />
                <Picker.Item label="Lazer" value="lazer" />
            </Picker>
            <Text>Categoria selecionada: {categoria}</Text>
        </Container>
    )
}


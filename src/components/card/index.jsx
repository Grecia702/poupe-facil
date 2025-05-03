import React, { useContext } from 'react'
import { Container, Tag, Title, Text, SubText } from './styles'
import { colorContext } from '@context/colorScheme';



export default function Card({ color, title, text, subtext, onPress, selected }) {
    const { isDarkMode } = useContext(colorContext)

    return (
        <Container color={isDarkMode ? "rgb(43, 43, 43)" : "white"} selected={selected} onPress={onPress}>
            <Tag color={color} />
            <Title color={isDarkMode ? "white" : "rgb(43, 43, 43)"}>{title}</Title>
            <Text color={isDarkMode ? "white" : "rgb(43, 43, 43)"}>R${text}</Text>
        </Container>
    );
}

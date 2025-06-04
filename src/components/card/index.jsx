import { View } from 'react-native';
import React, { useContext } from 'react'
import { Container, Tag, Title, Text, SubText } from './styles'
import { colorContext } from '@context/colorScheme';



export default function Card({ color, title, text, onPress, selected, selectedItem }) {
    const { isDarkMode } = useContext(colorContext)
    const isPressed = selectedItem === selected ? true : false
    return (
        <Container color={color} background={isDarkMode ? "#333" : "#FFF"} onPressIn={onPress} isPressed={isPressed}>
            <Tag color={color} />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Title color={isDarkMode ? "#ddd" : "rgb(43, 43, 43)"} isPressed={isPressed}>{title}</Title>
                <Title color={isDarkMode ? "#ddd" : "rgb(43, 43, 43)"} isPressed={isPressed}>{text}</Title>
            </View>
        </Container>
    );
}

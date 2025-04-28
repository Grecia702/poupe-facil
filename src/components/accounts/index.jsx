
import React, { useState, useContext } from 'react'
import { AccountCard, Balance, IconCard, InfoView, TextContainer, Title } from './styles'
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";
import { colorContext } from '@context/colorScheme'


export default function Account({ name, value, color, textColor, onPress, id }) {

    const { isDarkMode } = useContext(colorContext)
    return (
        <AccountCard onPress={() => onPress(id)}>
            <IconCard color={color}>
                <MaterialIcons
                    name="account-balance-wallet"
                    size={24} color="black"
                />
            </IconCard>
            <TextContainer>
                <Title color={textColor}>{name}</Title>
            </TextContainer>
            <InfoView>
                <Balance color={textColor}>{value}</Balance>
                <TouchableOpacity onPress={() => console.log(name)}>
                    <MaterialIcons
                        name="more-vert" size={24}
                        color={color}
                    />
                </TouchableOpacity>
            </InfoView>
        </AccountCard>
    )
}




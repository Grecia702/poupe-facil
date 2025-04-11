
import React from 'react'
import { AccountCard, Balance, IconCard, InfoView, Separator, Title } from './styles'
import { MaterialIcons } from '@expo/vector-icons'


export default function Account({ name, color, textColor }) {
    return (
        <AccountCard>

            <IconCard color={color}>
                <MaterialIcons name="account-balance-wallet" size={24} color="black" />
            </IconCard>

            <InfoView>
                <Title color={textColor}>{name}</Title>
                <Balance color={textColor}>R$400,00</Balance>
            </InfoView>
        </AccountCard>
    )
}




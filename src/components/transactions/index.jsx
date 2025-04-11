import { CardTransaction, Title, Date, IconCard, InfoView, Value } from "./styles";
import { MaterialIcons } from '@expo/vector-icons'

export default function TransactionCard({ iconName, state, color, category, date, value }) {

    return (
        <CardTransaction >
            <IconCard color={color}>
                <MaterialIcons name={iconName} size={24} color="white" />
            </IconCard>

            <InfoView>
                <Title $state={state}>{category}</Title>
                <Date $state={state}>{date}</Date>
            </InfoView>

            <Value $state={state}>{value}</Value>
        </CardTransaction>
    )
}
import { TouchableOpacity, View, Text } from "react-native";
import { CardTransaction, Title, Date, IconCard, InfoView, Value } from "./styles";
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

export default function TransactionCard({ iconName, state, color, category, date, value, isVisible, setVisibleId, id }) {
    const navigation = useNavigation();

    const handleToggleDropdown = () => {
        setVisibleId(id);
        if (isVisible) {
            setVisibleId(null)
        }
    };

    const DropDown = () => {
        return (
            <>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    right: 20,
                    backgroundColor: '#3b3b3b',
                    elevation: 10,
                    borderWidth: 1,
                    borderRadius: 6,
                    height: 'auto',
                    zIndex: 1,
                }}>
                    <TouchableOpacity onPress={() => navigation.navigate('EditTransactions', { transactionId: id })
                    } style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                        <Text style={{ color: 'white', textAlign: 'center' }}>Editar</Text>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: "#222", height: 2, width: '100 %' }} />
                    <TouchableOpacity style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                        <Text style={{ color: 'white', textAlign: 'center' }}>Apagar</Text>
                    </TouchableOpacity>
                </View>
            </>
        );
    }

    return (
        <View style={{ position: 'relative' }}>
            {isVisible && <DropDown />}
            <CardTransaction >
                <IconCard color={color}>
                    <MaterialIcons name={iconName} size={24} color="white" />
                </IconCard>
                <InfoView>
                    <Title $state={state}>{category}</Title>
                    <Date $state={state}>{date}</Date>
                </InfoView>

                <Value $state={state}>{value}</Value>
                <TouchableOpacity onPress={handleToggleDropdown}>
                    <MaterialIcons name="more-vert" size={24} color={state ? "white" : "black"} />
                </TouchableOpacity>
            </CardTransaction>
        </View>
    )
}
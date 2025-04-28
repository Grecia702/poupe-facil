import { TouchableOpacity, View, Text, Pressable } from "react-native";
import { CardTransaction, Title, Date, IconCard, InfoView, Value } from "./styles";
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { colorContext } from '@context/colorScheme'
import { useContext } from "react";

export default function TransactionCard({ iconName, state, color, category, date, value, isVisible, setVisibleId, id }) {
    const navigation = useNavigation();

    const { isDarkMode } = useContext(colorContext)
    const handleToggleDropdown = () => {
        setVisibleId(isVisible ? null : id);
    };

    const categoriaIcons = {
        Contas: 'credit-card',
        Alimentação: 'restaurant-menu',
        Carro: 'directions-car',
        Internet: 'computer',
        Lazer: 'beach-access',
        Educação: 'menu-book',
        Compras: 'shopping-cart',
        Outros: 'more-horiz',
    };

    const handleClose = () => {
        setVisibleId(null);
    };

    const DropDown = () => {
        return (
            <>
                <Pressable
                    onPress={handleClose}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                    }}
                />

                <View style={{
                    position: 'absolute',
                    top: 0,
                    right: 20,
                    backgroundColor: isDarkMode ? '#3b3b3b' : '#fff',
                    elevation: 10,
                    borderWidth: 1,
                    borderRadius: 6,
                    height: 'auto',
                    zIndex: 1,
                }}>
                    <TouchableOpacity onPress={() => navigation.navigate('EditTransactions', { transactionId: id })
                    } style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                        <Text style={{ color: isDarkMode ? '#EEE' : '#222', textAlign: 'center' }}>Editar</Text>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: "#222", height: 2, width: '100 %' }} />
                    <TouchableOpacity style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                        <Text style={{ color: isDarkMode ? '#EEE' : '#222', textAlign: 'center' }}>Apagar</Text>
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
                    <MaterialIcons
                        name={categoriaIcons[iconName] || 'help-outline'}
                        color="white"
                        size={24}
                    />
                </IconCard>
                <InfoView>
                    <Title $state={state}>{category}</Title>
                    <Date $state={state}>{date}</Date>
                </InfoView>

                <Value $state={state}>{value}</Value>
                <TouchableOpacity onPress={handleToggleDropdown}>
                    <MaterialIcons
                        name="more-vert" size={24}
                        color={state ? "white" : "black"} />
                </TouchableOpacity>
            </CardTransaction>




        </View>
    )
}
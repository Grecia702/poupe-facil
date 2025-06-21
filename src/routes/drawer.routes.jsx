import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { Feather, MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useContext, useState } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { colorContext } from '@context/colorScheme';
import TabRoutes from './tab.router';
import Transactions from '@screens/Transactions/Transactions'
import Accounts from '@screens/Accounts'
import CreditCards from '@screens/CreditCards'
import Budget from '@screens/Budget'
import Chatbot from '@screens/Chatbot'
import Overview from '@screens/Overview'
import Logout from '@screens/Logout'
import Settings from '@screens/Settings'
import Profile from '@screens/Profile';
import TopTabRoutes from './top_tabs.routes';
import GoalsTabsRoutes from './goals_tabs.routes';
import DefaultIconSvg from '@assets/user-svg.svg'
import { useProfile } from '@hooks/useProfile'

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
    const { isDarkMode } = useContext(colorContext);
    const { data } = useProfile();

    return (
        <DrawerContentScrollView {...props}>
            <View style={{ alignSelf: 'center', alignItems: 'center' }}>
                <View style={[styles.image]}>
                    {data?.picture_path ? (
                        <Image
                            source={{ uri: data.picture_path }}
                            style={{ width: 128, height: 128, borderRadius: 64 }}
                            resizeMode="cover"
                        />
                    ) : (
                        <DefaultIconSvg width={128} height={128} />
                    )}
                </View>
                <View style={[styles.nameContainer, { backgroundColor: isDarkMode ? '#505050' : '#b4ccba' }]}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                            fontSize: 20,
                            fontWeight: '600',
                            color: isDarkMode ? '#cccc' : '#0d521e',
                        }}
                    >
                        {data?.nome}
                    </Text>
                </View>
            </View>

            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
};

export default function DrawerRoutes() {
    const { isDarkMode, toggleDarkMode } = useContext(colorContext)
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    return (
        <>
            <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    drawerStyle: {
                        backgroundColor: isDarkMode ? "#202020" : "#dde6e9",
                        width: 300,
                    },
                    drawerLabelStyle: {
                        color: isDarkMode ? "#888787" : "#1f2122",
                    },
                    headerStyle: {
                        backgroundColor: isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E',
                        // borderBottomWidth: 1,
                        // borderColor: isDarkMode ? "rgba(240, 240, 240, 0.05)" : 'rgba(0, 0, 0, 0.05)',
                    },
                    headerTintColor: isDarkMode ? 'white' : 'black',
                    drawerActiveTintColor: isDarkMode ? "#b9b9b9" : 'green',
                    drawerInactiveTintColor: isDarkMode ? "#5a5757" : '#1a3523',
                    drawerActiveBackgroundColor: isDarkMode ? '#3a3939' : '#c7eec7',
                    headerRight: () =>
                        <TouchableOpacity
                            onPress={() => toggleDarkMode(true)}
                            style={{ marginRight: 20 }}
                        >
                            <Feather name={isDarkMode ? "moon" : "sun"} size={24} color={isDarkMode ? "white" : "black"}></Feather>
                        </TouchableOpacity>,
                }} >
                <Drawer.Screen
                    name="Início"
                    component={TabRoutes}
                    options={{
                        drawerIcon: ({ color, size }) => <MaterialIcons name="grid-view" size={size} color={color} />,
                        drawerLabel: 'Inicio',
                    }}
                />
                <Drawer.Screen
                    name="Transações"
                    component={Transactions}
                    options={{
                        drawerIcon: ({ color, size }) => <MaterialIcons name="trending-down" size={size} color={color} />,
                        drawerLabel: 'Transações',
                    }}
                />
                <Drawer.Screen
                    name="Contas"
                    component={Accounts}
                    options={{
                        drawerIcon: ({ color, size }) => <FontAwesome name="bank" size={size} color={color} />,
                        drawerLabel: 'Contas',
                    }}
                />
                {/* <Drawer.Screen
                    name="Cartões de Crédito"
                    component={CreditCards}
                    options={{
                        drawerIcon: ({ color, size }) => <Feather name="credit-card" color={color} size={size} />,
                        drawerLabel: 'Cartões de Crédito',
                    }}
                />
                <Drawer.Screen
                    name="Orçamento"
                    component={Budget}
                    options={{
                        drawerIcon: ({ color, size }) => <MaterialIcons name="account-balance-wallet" size={size} color={color} />,
                        drawerLabel: 'Orçamento',
                    }}
                /> */}
                <Drawer.Screen
                    name="Metas"
                    component={GoalsTabsRoutes}
                    options={{
                        drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="piggy-bank" size={size} color={color} />,
                        drawerLabel: 'Metas',
                        headerShown: false
                    }}
                />
                <Drawer.Screen
                    name="Gráficos"
                    component={TopTabRoutes}
                    options={{
                        drawerIcon: ({ color, size }) => <MaterialIcons name="pie-chart" size={size} color={color} />,
                        drawerLabel: 'Gráficos',
                        headerShown: false
                    }}
                />
                <Drawer.Screen
                    name="Assistente Virtual"
                    component={Chatbot}
                    options={{
                        drawerIcon: ({ color, size }) => <MaterialIcons name="message" size={size} color={color} />,
                        drawerLabel: 'Assistente Virtual',
                        headerShown: true
                    }}
                />
                <Drawer.Screen
                    name="Resumo Financeiro"
                    component={Overview}
                    options={{
                        drawerIcon: ({ color, size }) => <FontAwesome name="bar-chart" size={size} color={color} />,
                        drawerLabel: 'Resumo Financeiro',
                    }}
                />
                <Drawer.Screen
                    name="Perfil"
                    component={Profile}
                    options={{
                        drawerIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
                        drawerLabel: 'Perfil',
                        headerShown: true
                    }}
                />
                {/* <Drawer.Screen
                    name="Configurações"
                    component={Settings}
                    options={{
                        drawerIcon: ({ color, size }) => <Feather name="settings" color={color} size={size} />,
                        drawerLabel: 'Configurações',
                        headerShown: false
                    }}
                /> */}
                <Drawer.Screen
                    name="Logout"
                    options={{
                        drawerLabel: 'Logout',
                        drawerIcon: ({ color, size }) => <Feather name="log-out" color={color} size={size} />,
                    }}
                    listeners={{
                        drawerItemPress: e => {
                            e.preventDefault();
                            setShowLogoutModal(true);
                        }
                    }}
                >
                    {() => null}
                </Drawer.Screen>

            </Drawer.Navigator>
            <Logout
                isOpen={showLogoutModal}
                setIsOpen={() => setShowLogoutModal(false)}
            />
        </>
    )
}

const styles = StyleSheet.create({
    image: {
        borderRadius: 128,
        marginVertical: 12
    },
    nameContainer: {
        alignSelf: 'center',
        paddingHorizontal: 25,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 6,
        marginBottom: 24,
        flexWrap: 'wrap',
        maxWidth: 250,
        overflow: 'hidden',
    }
})
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Bar } from 'react-native-progress'
import { PieChart } from 'react-native-chart-kit'
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import login from './login';
import Ionicons from '@expo/vector-icons/Ionicons';

const Drawer = createDrawerNavigator();

function HomeScreen() {

  const data = [
    {
      name: 'Alimentação',
      gastos: 215,
      color: 'rgb(0, 47, 255)',
      legendFontColor: "rgb(100, 100, 100)",
      legendFontSize: 15
    },
    {
      name: 'Saúde',
      gastos: 130,
      color: 'rgb(206, 0, 0)',
      legendFontColor: "rgb(100, 100, 100)",
      legendFontSize: 15
    },
    {
      name: 'Compras',
      gastos: 80,
      color: 'rgb(0, 182, 0)',
      legendFontColor: "rgb(100, 100, 100)",
      legendFontSize: 15
    },
    {
      name: 'Contas',
      gastos: 90,
      color: 'rgb(255, 200, 0)',
      legendFontColor: "rgb(100, 100, 100)",
      legendFontSize: 15
    }
  ];
  return (
    <ScrollView contentContainerStyle={styles.safeArea}>

      <View style={styles.container}>

        <Text style={styles.textTitle}>Visão Geral</Text>
        <View style={styles.separator} />

        <View style={styles.saldoContainer}>

          <View style={styles.geral}>
            <Text style={styles.saldo}>Saldo Total:</Text>
            <Text style={styles.saldo}>R$3000,00</Text>
          </View>

          <View>
            <View style={styles.ganhos}>
              <Text style={styles.ganhosText}>Receita</Text>
              <Text style={styles.ganhosText}>R$ 2500,00</Text>
            </View>
            <View style={styles.despesas}>
              <Text style={styles.despesasText}>Despesas</Text>
              <Text style={styles.despesasText}>R$ 2500,00</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.textTitle}>Transações</Text>
        <View style={styles.separator} />
        <View style={styles.widget}>
          <View style={styles.icon}>
            <Ionicons name="cart" size={24} color="black" />
          </View>
          <View style={styles.transacao}>
            <Text>+R$2000,00</Text>
            <Text>15/03/2025</Text>
          </View>
        </View>
        <View style={styles.widget}>
          <View style={styles.icon}>
            <Ionicons name="cart" size={24} color="black" />
          </View>
          <View style={styles.transacao}>
            <Text>+R$3000,00</Text>
            <Text>20/03/2025</Text>
          </View>
        </View>
        <View style={styles.widget}>
          <View style={styles.icon}>
            <Ionicons name="cart" size={24} color="black" />
          </View>
          <View style={styles.transacao}>
            <Text>+R$3000,00</Text>
            <Text>20/03/2025</Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.textTitle}>Categorias de gastos</Text>
        <View style={styles.separator} />
        <View style={styles.widget}>
          <PieChart
            data={data}
            width={340}
            height={150}
            chartConfig={{
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="gastos"
            backgroundColor="transparent"
          />
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.textTitle}>Metas financeiras</Text>
        <View style={styles.separator} />
        <View style={[styles.widget, { flexDirection: 'column' }]}>
          <Text style={styles.metasTitle}>Comprar um carro</Text>
          <View style={styles.bar}>
            <Bar
              progress={0.5}
              color="rgb(38, 167, 38)"
              unfilledColor="rgb(168, 197, 168)"
              width={340}
              height={15}
              borderRadius={10}
              borderWidth={2}
              borderColor="rgb(16, 66, 16)"
            />
            <Text style={styles.metasLegend}>R$20.000,00 de R$40.000,00</Text>
          </View>
        </View>
      </View>

    </ScrollView>
  )
}

export default function App() {
  return (
    <Drawer.Navigator initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: "rgb(17, 165, 17)",
        },
        headerTintColor: "white"
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Transações" component={login} />
      <Drawer.Screen name="Contas Bancárias" component={login} />
      <Drawer.Screen name="Cartões de Crédito" component={login} />
      <Drawer.Screen name="Orçamento" component={login} />
      <Drawer.Screen name="Metas" component={login} />
      <Drawer.Screen name="Gráficos" component={login} />
      <Drawer.Screen name="Resumo Financeiro" component={login} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    alignItems: 'center',
    gap: 20,
    backgroundColor: "rgb(224, 243, 235)"
  },
  icon: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgb(214, 214, 214)',
    width: 'auto',
    padding: 10,
    borderWidth: 1,
    borderRadius: 24,
  },
  geral: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  textTitle: {
    fontSize: 32,

    color: "rgb(100, 100, 100)"
  },
  separator: {
    height: 1,
    width: "100%",
    maxWidth: 450,
    backgroundColor: "grey",
    marginHorizontal: "auto",
    marginBottom: 10,
  },
  saldo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: "rgb(66, 66, 66)"
  },
  saldoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 400,
    padding: 20,
    gap: 20,
    backgroundColor: "rgb(195, 212, 205)",
    borderRadius: 10,
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  ganhos: {
    width: 150,
    height: 60,
    justifyContent: 'center',
    backgroundColor: "rgb(160, 204, 160)",
    borderWidth: 2,
    borderColor: "rgb(2, 105, 2)",
    borderRadius: 10,
    marginBottom: 10,
  },
  despesas: {
    width: 150,
    height: 60,
    justifyContent: 'center',
    backgroundColor: "rgb(204, 160, 160)",
    borderWidth: 2,
    borderColor: "rgb(105, 2, 2)",
    borderRadius: 10,
  },
  ganhosText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "rgb(4, 124, 4)",
    alignSelf: "center"
  },
  despesasText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "rgb(124, 4, 4)",
    alignSelf: "center",
  },
  container: {
    width: "90%",
    alignItems: 'center'
  },
  widget: {
    flexDirection: 'row',
    height: "auto",
    maxWidth: 400,
    backgroundColor: "rgb(195, 212, 205)",
    borderRadius: 10,
    padding: 20,
    gap: 10,
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    marginBottom: 20,
  },
  transacao: {
    justifyContent: 'space-between',
    marginLeft: 200
  },
  bar: {
    alignSelf: 'center',
    maxWidth: 400,
    gap: 5,
  },
  metasTitle: {
    fontSize: 24,
    alignSelf: 'center',
    color: "rgb(100, 100, 100)",
    textDecorationLine: "underline"
  },
  metasLegend: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgb(100, 100, 100)",
  },
}) 

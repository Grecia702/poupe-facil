import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Bar } from 'react-native-progress'
import { PieChart } from 'react-native-chart-kit'
import React, { useContext } from 'react';
import BankAccount from './accounts';
import Transactions from './transactions';
import { colorContext } from '../../context/colorScheme';



export default function HomeScreen() {
  const { isDarkMode, changeState } = useContext(colorContext)

  const areaView = isDarkMode ? "rgb(27, 27, 27)" : "rgb(211, 236, 248)"
  const separator = isDarkMode ? "white" : "black"
  const text = isDarkMode ? "white" : "black"
  const widget = isDarkMode ? "rgb(40,40,40)" : "rgb(230, 230, 230)"

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
    <ScrollView contentContainerStyle={[styles.safeArea, { backgroundColor: areaView }]}>

      <View style={[styles.container]}>
        <Text style={[styles.textTitle, { color: text }]}>Visão Geral</Text>
        <View style={[styles.separator, { backgroundColor: separator }]} />
        <View style={[styles.visaoGeral, { backgroundColor: widget }]}>

          <Text style={[styles.saldo, { color: text }]}>Saldo Total:</Text>
          <Text style={[styles.saldo, { color: text }]}>R$3000,00</Text>

          <View style={styles.saldoInfo}>
            <Text style={[styles.saldoInfoText, { color: text }]}>Receita</Text>
            <Text style={[styles.saldoInfoText, { color: text }]}>R$ 2500,00</Text>
          </View>
          <View style={[styles.saldoInfo, { backgroundColor: "rgb(204, 160, 160)", borderColor: "rgb(105, 2, 2)", }]}>
            <Text style={[[styles.saldoInfoText, { color: text }], { color: "rgb(124, 4, 4)" }]}>Despesas</Text>
            <Text style={[[styles.saldoInfoText, { color: text }], { color: "rgb(124, 4, 4)" }]}>R$ 2500,00</Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={[styles.textTitle, { color: text }]}>Contas</Text>
        <View style={[styles.separator, { backgroundColor: separator }]} />
        <View style={[styles.widget, { minHeight: 200, backgroundColor: widget }]}>
          <BankAccount limit={5} />
        </View>
      </View>

      <View style={styles.container}>
        <Text style={[styles.textTitle, { color: text }]}>Contas</Text>
        <View style={[styles.separator, { backgroundColor: separator }]} />
        <View style={[styles.widget, { minHeight: 200, backgroundColor: widget }]}>
          <Transactions limit={5} />
        </View>
      </View>


      <View style={styles.container}>
      </View>

      <View style={styles.container}>
        <Text style={[styles.textTitle, { color: text }]}>Categorias de gastos</Text>
        <View style={[styles.separator, { backgroundColor: separator }]} />
        <View style={[styles.widget, { backgroundColor: widget }]}>
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
        <Text style={[styles.textTitle, { color: text }]}>Metas financeiras</Text>
        <View style={[styles.separator, { backgroundColor: separator }]} />
        <View style={[styles.widget, { flexDirection: 'column', backgroundColor: widget }]}>
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

const styles = StyleSheet.create({
  safeArea: {
    alignItems: 'center',
    gap: 20,
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
  },
  separator: {
    height: 2,
    width: "100%",
    maxWidth: 450,
    marginHorizontal: "auto",
    marginBottom: 10,
  },
  visaoGeral: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 400,
    padding: 20,
    gap: 20,
    flexWrap: 'wrap',
    height: 'auto',
    borderRadius: 10,
  },
  saldo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: "rgb(214, 214, 214)"
  },
  saldoInfo: {
    width: 150,
    height: 60,
    justifyContent: 'center',
    backgroundColor: "rgb(160, 204, 160)",
    borderWidth: 2,
    borderColor: "rgb(2, 105, 2)",
    borderRadius: 10,
    marginBottom: 10,
  },
  saldoInfoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "rgb(4, 124, 4)",
    alignSelf: "center"
  },

  container: {
    width: "100%",
    alignItems: 'center'
  },
  widget: {
    flexDirection: 'row',
    height: "auto",
    minWidth: 400,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    gap: 10,
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
    textDecorationLine: "underline"
  },
  metasLegend: {
    fontSize: 16,
    fontWeight: "500",
  },
})


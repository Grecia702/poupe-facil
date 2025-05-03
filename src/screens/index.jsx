import { View, Text, TouchableOpacity } from 'react-native';
import { colorContext } from '@context/colorScheme';
import { FlatList, Pressable } from 'react-native';
import React, { useContext, useEffect, useState, useMemo } from 'react'
import { CATEGORIAS } from '../utils/categorias'
import { Container, Wrapper } from '../components/main/styles';
import Card from '@components/card';
import ContentLoader, { Rect } from 'react-content-loader/native'
import PieChart from '@components/pieChart';
import { WidgetView } from '@components/transactions/styles';
import { useNavigation } from '@react-navigation/native';
import TransactionCard from '@components/transactions';
import WidgetTeste from '@components/widget';
import Account from '@components/accounts';
import { Separator } from '@components/accounts/styles';
import * as Progress from 'react-native-progress';
import VisaoGeral from '@components/header';
import { useTransactionAuth } from '@context/transactionsContext';
import { useContasAuth } from '@context/contaContext';


const groupByCategory = ((dadosAPI) => {
  if (!dadosAPI) {
    return [];
  }

  return Object.values(
    dadosAPI.reduce((acc, item) => {
      const valor = parseFloat(item.valor);
      if (!acc[item.categoria]) {
        acc[item.categoria] = { x: item.categoria, y: 0, z: 0 };
      }
      acc[item.categoria].y += valor;
      acc[item.categoria].z += 1;
      return acc;
    }, {})
  );
});

const GroupByType = ((dadosAPI) => {
  return dadosAPI?.reduce((acc, item) => {
    const valor = parseFloat(item.valor)
    if (item.tipo === "Despesa") {
      acc.despesas -= valor;
    }
    else {
      acc.receitas += valor;
    }
    return acc;
  }, { receitas: 0, despesas: 0 })
})

export default function HomeScreen() {
  const { dadosAPI } = useTransactionAuth();
  const { dadosContas } = useContasAuth();
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshing, setRefreshing] = useState(true);
  const [progress, setProgress] = useState(0.00);
  const navigation = useNavigation();
  const { isDarkMode } = useContext(colorContext)

  const resultGroupBy = useMemo(() => {
    return groupByCategory(dadosAPI);
  }, [dadosAPI])

  const transacoes = useMemo(() => {
    return GroupByType(dadosAPI);
  }, [dadosAPI])


  const recentTransactions = dadosAPI?.sort((a, b) => new Date(b.data_transacao) - new Date(a.data_transacao))
    .slice(0, 5);



  const saldo = dadosContas?.reduce((acc, item) => {
    return acc + parseFloat(item.saldo)
  }, 0)

  const saldoContas = saldo?.toFixed(2)

  const saldoTotal = (transacoes?.receitas - transacoes?.despesas) || 0


  useEffect(() => {
    console.log(resultGroupBy);
  }, [resultGroupBy]);

  useEffect(() => {
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, [])

  const handleSelectItem = (label) => {
    setSelectedItem(label);
  };


  // Função pra buscar a cor de uma categoria em um array de objetos
  function findColor(props) {
    return CATEGORIAS.find(({ label }) => label === props).color
  }

  return (
    <Container color={isDarkMode ? "rgb(26, 26, 26)" : "#c6ebe9"}>
      <VisaoGeral saldo={(saldoTotal).toFixed(2) ?? 0} receitas={transacoes?.receitas} despesas={transacoes?.despesas} />
      <Wrapper>
        <WidgetTeste Color={isDarkMode ? "#2e2e2e" : "#ffffffd5"} Text={"Contas"} TextColor={isDarkMode ? "#e9e9e9" : "#3a3a3a"} >
          <Text onPress={() => navigation.navigate('Contas')}
            style={{
              textDecorationLine: 'underline',
              color: isDarkMode ? "#e9e9e9" : "#202020",
              fontSize: 12,
              alignSelf: 'flex-end',
            }}>Ver mais</Text>
          {
            dadosContas?.map(item => (
              (<Account
                name={item.nome_conta}
                key={item.id}
                value={item.saldo}
                icon={item.icone}
                color={isDarkMode ? "#222" : "#DDD"}
                textColor={isDarkMode ? "#CCC" : "#222"}
              />)
            ))
          }
          <Separator color={isDarkMode ? "#cccccc6f" : "#22222275"} />
          <Text style={{ fontSize: 16, color: isDarkMode ? "#e9e9e9" : "#2c2c2c" }}>Saldo Total:</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDarkMode ? "#e9e9e9" : "#2c2c2c" }}>R${saldoContas}</Text>
        </WidgetTeste>


        <WidgetTeste Color={isDarkMode ? "#2e2e2e" : "#ffffffd5"} Text={"Orçamento"} TextColor={isDarkMode ? "#e9e9e9" : "#3a3a3a"} >
          <Pressable onPress={() => upCount()} style={{ backgroundColor: 'red', width: 60, height: 30, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }} >{progress}</Text>
          </Pressable>
          <Pressable onPress={() => setProgress(0)} style={{ backgroundColor: 'green', width: 60, height: 30, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }} >{progress}</Text>
          </Pressable>
          <Progress.Circle
            borderWidth={4}
            borderColor={"white"}
            strokeCap={'square'}
            size={150}
            thickness={15}
            direction={'counter-clockwise'}
            color={(progress < 0.8) ? '#03c21d' : "#f3a006"}
            progress={progress}
            animated={true}
            showsText={true} />
        </WidgetTeste>


        <WidgetTeste Color={isDarkMode ? "#2e2e2e" : "#ffffffd5"} Text={"Transações"}
          TextColor={isDarkMode ? "#e9e9e9" : "#3a3a3a"}
        >
          <Text onPress={() => navigation.navigate('Transações')}
            style={{
              textDecorationLine: 'underline',
              color: isDarkMode ? "#e9e9e9" : "#202020",
              fontSize: 12,
              alignSelf: 'flex-end',
            }}>Ver mais</Text>

          {Array.isArray(recentTransactions) ? (
            recentTransactions.map((item, index) => (
              <TransactionCard
                key={index}
                iconName={item?.categoria}
                color={item?.tipo === "Despesa" ? "#dd5454" : "#2563EB"}
                state={isDarkMode}
                category={item?.categoria}
                type={item?.natureza}
                recurrence={item?.recorrente}
                date={item?.data_transacao}
                value={item?.valor} />
            ))
          ) : (
            <>
              <Text>Voce não criou nenhuma transação</Text>
              <TouchableOpacity style={{ backgroundColor: '#3044b8' }}>
                <Text style={{ color: '#FFF' }}>Criar</Text>
              </TouchableOpacity>
            </>
          )
          }
        </WidgetTeste>
        <WidgetView color={isDarkMode ? "#2e2e2e" : "#ffffffd5"}>
          <PieChart height={350} width={350} data={resultGroupBy} total={saldoTotal} selected={selectedItem} />
        </WidgetView>

        <View style={{}}>
          {refreshing ? (

            <ContentLoader
              speed={1}
              width={400}
              height={400}
              viewBox={`0 0 300 300`}
              backgroundColor={isDarkMode ? "#292929" : "rgb(224, 224, 224)"}
              foregroundColor={isDarkMode ? "#1b1b1b" : "rgb(190, 190, 190)"}
            >
              <Rect x="0" y="0" width="93%" height="60" />
              <Rect x="0" y="70" width="93%" height="60" />
              <Rect x="0" y="140" width="93%" height="60" />
              <Rect x="0" y="210" width="93%" height="60" />
              <Rect x="0" y="280" width="93%" height="60" />
            </ContentLoader>
          ) : (
            <FlatList
              data={resultGroupBy}
              keyExtractor={(item) => item.x}
              refreshing={refreshing}
              scrollEnabled={false}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={5}
              renderItem={({ item }) => (
                <Card
                  // Função para buscar a cor do ITEM LABEL que está sendo renderizado na flatlist
                  color={findColor(item.x)}
                  title={item.x}
                  text={(item.y).toFixed(2)}
                  // subtext={item.percent}
                  selected={selectedItem === item.x || selectedItem === true}
                  onPress={() => handleSelectItem(item.x)}
                />
              )}
            />
          )
          }
        </View>

        <WidgetTeste direction={'column'} gap={5} Color={isDarkMode ? "#2e2e2e" : "#ffffffd5"} Text={"Metas"} TextColor={isDarkMode ? "#c4c4c4" : "#3a3a3a"} >
          <Text style={{ alignSelf: 'center', color: isDarkMode ? "#FFF" : "#132217", fontSize: 18, fontWeight: '600', marginTop: 10 }}>Comprar um PC</Text>
          <Progress.Bar
            height={20}
            width={320}
            color={"#4CAF50"}
            unfilledColor={'#C8E6C9'}
            progress={progress}
            borderWidth={1}
            borderRadius={15}
            borderColor={"#000"}
          >
            <Text style={{ position: 'absolute', color: '#1B5E20', marginLeft: '87.5%', fontWeight: 'bold' }}>
              {Math.round(progress * 100)}%
            </Text>
          </Progress.Bar>
          <Text style={{ color: isDarkMode ? '#7bf185' : '#215a26' }}>1660,00 de  40000,00</Text>
        </WidgetTeste>
      </Wrapper>
    </Container >
  );
}

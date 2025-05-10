import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { colorContext } from '@context/colorScheme';
import { FlatList, Pressable } from 'react-native';
import React, { useContext, useState, useMemo } from 'react'
import { categoriaCores } from '../utils/categoriasCores'
import { Wrapper } from '../components/main/styles';
import Card from '@components/card';
import ContentLoader, { Rect } from 'react-content-loader/native'
import PieChart from '@components/pieChart';
import { useNavigation } from '@react-navigation/native';
import TransactionCard from '@components/transactions';
import WidgetTeste from '@components/widget';
import Account from '@components/accounts';
import { Separator } from '@components/accounts/styles';
import * as Progress from 'react-native-progress';
import VisaoGeral from '@components/header';
import { useTransactionAuth } from '@context/transactionsContext';
import { useContasAuth } from '@context/contaContext';
import { useTransactionSummary } from '@hooks/useTransactionSummary';

export default function HomeScreen() {

  const { dadosAPI, isLoading, dadosCategorias, isCategoriesLoading } = useTransactionAuth();
  const { dadosContas } = useContasAuth();
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshing, setRefreshing] = useState(true);
  const [progress, setProgress] = useState(0.00);
  const navigation = useNavigation();
  const { isDarkMode } = useContext(colorContext)
  const { data } = useTransactionSummary({
    all: true
  });
  const overallBalance = data?.find(item => item.tipo === "Total").total || 0;
  const expenses = data?.find(item => item.tipo === "despesa").total || 0;
  const incomes = data?.find(item => item.tipo === "receita").total || 0;


  const total = dadosCategorias?.reduce((acc, item) => {
    acc += item.total
    return acc
  }, 0)

  const recentTransactions = dadosAPI?.sort((a, b) => new Date(b.data_transacao) - new Date(a.data_transacao))
    .slice(0, 5);

  const saldo = dadosContas?.reduce((acc, item) => {
    return acc + parseFloat(item.saldo)
  }, 0)



  const handleSelectItem = (label) => {
    setSelectedItem(label);
  };


  return (
    <ScrollView style={{ backgroundColor: isDarkMode ? "rgb(26, 26, 26)" : "#c6ebe9" }}>
      <VisaoGeral saldo={overallBalance} receitas={incomes} despesas={expenses} />
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
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDarkMode ? "#e9e9e9" : "#2c2c2c" }}>R${saldo?.toFixed(2)}</Text>
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

        <WidgetTeste Color={isDarkMode ? "#2e2e2e" : "#ffffffd5"} Text={"Gráficos"} TextColor={isDarkMode ? "#e9e9e9" : "#3a3a3a"} >

          <TouchableOpacity onPress={() => navigation.navigate('Gráficos')} >
            {!isCategoriesLoading && <PieChart height={350} width={350} data={dadosCategorias} total={total} padAngle={3} selected={selectedItem} />}
          </TouchableOpacity>


        </WidgetTeste>

        <View style={{}}>
          {isLoading ? (

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
              data={dadosCategorias}
              keyExtractor={(item) => item.categoria}
              refreshing={refreshing}
              scrollEnabled={false}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={5}
              renderItem={({ item }) => (
                <Card
                  color={categoriaCores[item.categoria]}
                  title={item.categoria}
                  text={(item.total)}
                  selectedItem={selectedItem}
                  selected={selectedItem === item.categoria ? selectedItem : 'none'}
                  onPress={() => handleSelectItem(item.categoria)}
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
    </ScrollView >
  );
}

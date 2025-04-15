import { View, Text } from 'react-native';
import { colorContext } from '../../context/colorScheme';
import { FlatList, Pressable } from 'react-native';
import React, { useContext, useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker';
import { CATEGORIAS } from '../utils/categorias'
import { EXPENSES } from '../utils/expenses'
import { Container, Title, TextParagraph, DropDown, Wrapper, Temp } from '../components/main/styles';
import Card from '@components/card';
import { MESES } from '../utils/months';
import ContentLoader, { Rect } from 'react-content-loader/native'
import Geral from '@components/header';
import PieChart from '@components/pieChart';
import { WidgetView } from '@components/transactions/styles';
import { useNavigation } from '@react-navigation/native';
import TransactionCard from '@components/transactions';
import WidgetTeste from '@components/widget';
import Account from '@components/accounts';
import { Separator } from '@components/accounts/styles';
import * as Progress from 'react-native-progress';

export default function HomeScreen() {
  const [meses, setMeses] = useState(MESES[0].label);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshing, setRefreshing] = useState(true);
  const [progress, setProgress] = useState(0.00);
  const navigation = useNavigation();
  const mensalExpense = EXPENSES[meses];
  const { isDarkMode } = useContext(colorContext)

  const upCount = () => {
    if (progress < 1) {
      setProgress(progress => Math.round((progress + 0.05) * 100) / 100);
    }
  }

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  useEffect(() => {
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, [])

  const handleSelectItem = (label) => {
    setSelectedItem(label);
  };


  const arrFormatted = mensalExpense.map((
    { id, label, value, percent }) =>
    ({ id: id, value: value, label: label })
  );
  const total = arrFormatted.reduce((acc, valor) => acc + valor.value, 0).toFixed(2);

  // Função pra buscar a cor de uma categoria em um array de objetos
  function findColor(props) {
    return CATEGORIAS.find(({ label }) => label === props).color
  }

  return (
    <Container color={isDarkMode ? "rgb(26, 26, 26)" : "#c6ebe9"}>
      <Geral />
      <Wrapper>
        <WidgetTeste Color={isDarkMode ? "#2e2e2e" : "#ffffffd5"} Text={"Contas"} TextColor={isDarkMode ? "#e9e9e9" : "#3a3a3a"} >

          <Account name={'Conta Corrente'} color={isDarkMode ? "#e9e9e9" : "#f0eeee"} textColor={isDarkMode ? "#e9e9e9" : "#2c2c2c"} />
          <Account name={'Carteira'} color={isDarkMode ? "#e9e9e9" : "#f0eeee"} textColor={isDarkMode ? "#e9e9e9" : "#2c2c2c"} />
          <Account name={'Poupança'} color={isDarkMode ? "#e9e9e9" : "#f0eeee"} textColor={isDarkMode ? "#e9e9e9" : "#2c2c2c"} />
          <Separator isDarkMode={isDarkMode} />
          <Text style={{ fontSize: 16, color: isDarkMode ? "#e9e9e9" : "#2c2c2c" }}>Saldo Total:</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDarkMode ? "#e9e9e9" : "#2c2c2c" }}>R$1200,00</Text>
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
          <TransactionCard iconName="directions-car" color={'#2563EB'} state={isDarkMode} category={"Carro"} date={"11/09/2025"} value={"-3499,99"} />
          <TransactionCard iconName="fastfood" color={'#F97316'} state={isDarkMode} category={"Alimentação"} date={"11/09/2025"} value={"-249,99"} />
          <TransactionCard iconName="shopping-cart" color={'#ec34e3'} state={isDarkMode} category={"Compras"} date={"11/09/2025"} value={"-599,99"} />
          <TransactionCard iconName="shopping-cart" color={'#ec34e3'} state={isDarkMode} category={"Compras"} date={"11/09/2025"} value={"-999,99"} />
          <TransactionCard iconName="shopping-cart" color={'#ec34e3'} state={isDarkMode} category={"Compras"} date={"10/09/2025"} value={"-299,99"} />
        </WidgetTeste>

        <Temp>
          <Title color={isDarkMode ? "#dbf3f2" : "rgb(26, 26, 26)"}>Categorias</Title>
          <TextParagraph color={isDarkMode ? "#dbf3f2" : "rgb(26, 26, 26)"}>Selecione uma categoria</TextParagraph>
          <DropDown>
            <Picker
              selectedValue={meses}
              onValueChange={(itemValue) => {
                setMeses(itemValue)
              }}
              style={{
                height: 50,
                flex: 1,
                backgroundColor: '#FFF',
                color: 'black'
              }}
            >
              {
                MESES.map(item =>

                (<Picker.Item
                  key={item.label}
                  label={item.label}
                  value={item.label}
                />
                ))
              }
            </Picker>
          </DropDown>
        </Temp>

        <WidgetView color={isDarkMode ? "#2e2e2e" : "#ffffffd5"}>
          <PieChart height={225} width={225} data={arrFormatted} total={total} selected={selectedItem} />
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
              data={arrFormatted}
              keyExtractor={(item) => item.id}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              scrollEnabled={false}
              renderItem={({ item }) => (


                <Card

                  // Função para buscar a cor do ITEM LABEL que está sendo renderizado na flatlist
                  color={findColor(item.label)}
                  title={item.label}
                  text={(item.value).toFixed(2)}
                  subtext={item.percent}
                  selected={selectedItem === item.label || selectedItem === true}
                  onPress={() => handleSelectItem(item.label)}
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

import { View, Text, TouchableOpacity, ScrollView, FlatList, Modal } from 'react-native';
import { colorContext } from '@context/colorScheme';
import { useContext, useState, useMemo } from 'react'
import { categoriaCores } from '@utils/categoriasCores'
import Wrapper from '@components/wrapper';
import Card from '@components/card';
import ContentLoader, { Rect } from 'react-content-loader/native'
import PieChart from '@components/pieChart';
import { useNavigation } from '@react-navigation/native';
import TransactionCard from '@components/transactions';
import WidgetTeste from '@components/widget';
import Account from '@components/accounts';
import { Separator } from '@components/accounts/styles';
import VisaoGeral from '@components/header';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTransactionAuth } from '@context/transactionsContext';
import { useBudgetAuth } from '@context/budgetsContext';
import { useContasAuth } from '@context/contaContext';
import { useGoals } from '@hooks/useGoals';
import CalendarEmpty from '@assets/calendar-empty.svg';
import TargetArrow from '@assets/target-arrow.svg';
import TransactionEmpty from '@assets/empty-cart.svg';
import AccountEmpty from '@assets/bank-account.svg';
import Budget from '@components/budgetBars';
import CreateItem from '@components/createItem';
import Goals from '@components/goals';
import NavMonths from '@components/navMonths';
import { startOfMonth, endOfMonth, set, format, addMonths, subMonths } from 'date-fns'
import { useDonutchartData } from '@hooks/useDonutchartData';



export default function HomeScreen() {
  const { useFilteredTransacoes } = useTransactionAuth();
  const { data: transactionData, refetch, isLoading } = useFilteredTransacoes();
  const { dadosContas } = useContasAuth();
  const { balanceAccount, lastDate, setLastDate } = useContasAuth({});
  const { budgetData } = useBudgetAuth()
  const { data: goalsData } = useGoals()
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshing, setRefreshing] = useState(true);
  const navigation = useNavigation();
  const { isDarkMode } = useContext(colorContext)
  const firstDate = set(startOfMonth(new Date()), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })

  const { data: donutData, isLoading: donutLoading } = useDonutchartData({
    first_date: firstDate,
    last_date: lastDate
  })

  const total = donutData?.reduce((acc, item) => {
    acc += item.total
    return acc
  }, 0) || 0
  const recentTransactions = transactionData?.pages[0].data.slice(0, 5);
  const saldo = dadosContas?.reduce((acc, item) => {
    return acc + parseFloat(item.saldo)
  }, 0)

  const handleSelectItem = (label) => {
    setSelectedItem(label);
  };


  return (
    <ScrollView style={{ backgroundColor: isDarkMode ? "rgb(26, 26, 26)" : "#c6ebe9" }}>

      <VisaoGeral
        saldo={(balanceAccount?.saldo_total || 0)}
        balanco_geral={(balanceAccount?.balanco_geral || 0)}
        despesa={(balanceAccount?.despesa || 0)}
        receita={(balanceAccount?.receita || 0)}
      >
        <View style={{ flexDirection: 'row', alignSelf: 'center', gap: 5 }}>
          <TouchableOpacity onPress={() => setLastDate(prev => set(endOfMonth(subMonths(prev, 1)), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }))}>
            <MaterialIcons name="arrow-back-ios" size={24} color={isDarkMode ? "#CCC" : "#f3f3f3"} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDarkMode ? "#CCC" : "#f3f3f3" }}>
              {lastDate.toLocaleDateString('pt-BR', { month: 'long' }) + ' ' + lastDate.getFullYear()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLastDate(prev => set(endOfMonth(addMonths(prev, 1)), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }))}>
            <MaterialIcons name="arrow-forward-ios" size={24} color={isDarkMode ? "#CCC" : "#f3f3f3"} />
          </TouchableOpacity>
          {/* <NavMonths
            isDarkMode={isDarkMode}
            meses={monthIndex}
            open={open}
            setOpen={setOpen}
          /> */}
        </View>
      </VisaoGeral>
      <Wrapper>

        <WidgetTeste
          Color={isDarkMode ? "#2e2e2e" : "#fff"}
          Title={"Orçamento"}
          TextColor={isDarkMode ? "#e9e9e9" : "#3a3a3a"}
          onPressDetails={() => navigation.navigate('CreateBudget')}
        >
          {budgetData?.length > 0 ? (
            <>
              <Budget data={budgetData[0]} />
            </>
          ) : (
            <>
              <CreateItem
                text={'Nenhum orçamento encontrado.'}
                buttonText={'Criar orçamento'}
                screen={'CreateBudget'}
                icon={
                  <CalendarEmpty color={isDarkMode ? "#AAA" : "#000000"} width={96} height={96} />
                }
              />
            </>
          )}
        </WidgetTeste>

        <WidgetTeste
          Color={isDarkMode ? "#2e2e2e" : "#ffffff"}
          Title={"Contas"} TextColor={isDarkMode ? "#e9e9e9" : "#3a3a3a"}
          onPressDetails={() => navigation.navigate('Accounts')}
        >
          {dadosContas?.length > 0 ? (
            <>
              {dadosContas.map(item => (
                <Account
                  key={item.id.toString()}
                  name={item.nome_conta}
                  value={item.saldo}
                  icon={item.icone}
                  color={isDarkMode ? "#222" : "#DDD"}
                  textColor={isDarkMode ? "#CCC" : "#222"}
                  hideOption
                />
              ))}

              <Separator color={isDarkMode ? "#cccccc6f" : "#22222275"} />

              <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: isDarkMode ? "#e9e9e9" : "#2c2c2c" }}>
                  Saldo Total:
                </Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDarkMode ? "#e9e9e9" : "#2c2c2c" }}>
                  R${saldo?.toFixed(2)}
                </Text>
              </View>
            </>
          ) : (
            <CreateItem
              text={'Nenhuma conta bancária encontrada.'}
              buttonText={'Criar conta'}
              screen={'CreateAccount'}
              icon={
                <AccountEmpty color={isDarkMode ? "#AAA" : "#000000"} width={96} height={96} />
              }
            />
          )}

        </WidgetTeste>

        <WidgetTeste
          Color={isDarkMode ? "#2e2e2e" : "#ffffff"}
          Title={"Transações"}
          TextColor={isDarkMode ? "#e9e9e9" : "#3a3a3a"}
          onPressDetails={() => navigation.navigate('Transações')}
        >
          {recentTransactions?.length > 0 ? (
            recentTransactions.map((item, index) => (
              <TransactionCard
                key={index}
                iconName={item?.categoria}
                color={item?.tipo === "despesa" ? "#dd5454" : "#2563EB"}
                state={isDarkMode}
                name_transaction={item?.nome_transacao}
                conta={item?.conta}
                category={item?.categoria}
                type={item?.natureza}
                recurrence={item?.recorrente}
                date={item?.data_transacao}
                value={item?.valor}
                hideOption
              />
            ))
          ) : (
            <>
              <CreateItem
                text={'Nenhuma transação encontrada.'}
                buttonText={'Criar Transação'}
                screen={'CreateTransaction'}
                icon={
                  <TransactionEmpty color={isDarkMode ? "#AAA" : "#000000"} width={96} height={96} />
                }
              />
            </>
          )
          }
        </WidgetTeste>

        <WidgetTeste Color={isDarkMode ? "#2e2e2e" : "#ffffff"} Title={"Gráficos"} TextColor={isDarkMode ? "#e9e9e9" : "#3a3a3a"} >

          <TouchableOpacity onPress={() => navigation.navigate('Gráficos')} >
            {donutData && <PieChart height={350} width={350} data={donutData} total={total} padAngle={3} selected={selectedItem} />}
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
              data={donutData}
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
                  text={(item.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  selectedItem={selectedItem}
                  selected={selectedItem === item.categoria ? selectedItem : 'none'}
                  onPress={() => handleSelectItem(item.categoria)}
                />
              )}
            />
          )
          }
        </View>

        <WidgetTeste
          direction={'column'} gap={5}
          Color={isDarkMode ? "#2e2e2e" : "#ffffff"}
          Title={"Metas"}
          TextColor={isDarkMode ? "#c4c4c4" : "#3a3a3a"}
          onPressDetails={() => navigation.navigate('GoalsTabs')}
        >
          {goalsData?.metas.length > 0 ? (
            <Goals
              goal_desc={goalsData.metas[0]?.desc_meta}
              current_amount={goalsData.metas[0]?.saldo_meta}
              total_amount={goalsData.metas[0]?.valor_meta}
              start_date={goalsData.metas[0]?.data_inicio}
              end_date={goalsData.metas[0]?.deadline}
              status_meta={'andamento'}
            />
          ) : (
            <CreateItem
              text={'Nenhuma meta financeira encontrada.'}
              buttonText={"Criar meta"}
              screen={'Create Goal'}
              icon={
                <TargetArrow color={isDarkMode ? "#AAA" : "#2c2c2c"} width={96} height={96} />
              }
            />
          )
          }
        </WidgetTeste>
      </Wrapper>
    </ScrollView >
  );
}

import { View, Text, TouchableOpacity, ScrollView, FlatList, Modal, RefreshControl } from 'react-native';
import { colorContext } from '@context/colorScheme';
import { useContext, useState, useMemo } from 'react'
import { categoriaCores } from '@utils/categoriasCores'
import Wrapper from '@components/wrapper';
import Card from '@components/card';
import PieChart from '@components/pieChart';
import { useNavigation } from '@react-navigation/native';
import TransactionCard from '@components/transactions/transactionCard';
import WidgetTeste from '@components/widget';
import Account from '@components/accounts';
import { Separator } from '@components/accounts/styles';
import VisaoGeral from '@components/header';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTransactionAuth } from '@context/transactionsContext';
import { useBudgetAuth } from '@context/budgetsContext';
import { useBankAccount } from '@hooks/useBankAccount';
import { useGoals } from '@hooks/useGoals';
import CalendarEmpty from '@assets/calendar-empty.svg';
import TargetArrow from '@assets/target-arrow.svg';
import TransactionEmpty from '@assets/empty-cart.svg';
import AccountEmpty from '@assets/bank-account.svg';
import Budget from '@components/budgetBars';
import CreateItem from '@components/createItem';
import Goals from '@components/goals';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { startOfMonth, endOfMonth, set, format, addMonths, subMonths } from 'date-fns'
import { useDonutchartData } from '@hooks/useDonutchartData';
import CreateTransaction from '@components/createTransaction'
import { useTransaction } from '@hooks/useTransactions';

export default function HomeScreen() {
  // const { useFilteredTransacoes } = useTransactionAuth();
  // const { data: transactionData, refetch, isLoading } = useFilteredTransacoes();
  const { useFilteredTransactions } = useTransaction();
  const { data: transactionData, refetch, isLoading } = useFilteredTransactions();
  const { balanceAccount, lastDate, setLastDate, dadosContas, refetchAccountNow } = useBankAccount();
  const { budgetData, refetchBudget } = useBudgetAuth()
  const { data: goalsData, refetch: refetchGoals } = useGoals()
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const navigation = useNavigation();
  const { isDarkMode } = useContext(colorContext)
  const firstDate = set(startOfMonth(new Date()), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
  // const { data: donutData, isLoading: donutLoading, refetch: refetchDonut } = useDonutchartData({
  //   first_day: firstDate,
  //   last_day: lastDate
  // })

  // const total = donutData?.reduce((acc, item) => {
  //   acc += item.total
  //   return acc
  // }, 0) || 0
  const recentTransactions = transactionData?.pages[0]?.data.slice(0, 5);

  // console.log(recentTransactions)

  const handleSelectItem = (label) => {
    setSelectedItem(label);
  };

  const onRefresh = () => {
    setRefreshing(true);

    try {
      refetch()
      refetchBudget()
      refetchAccountNow()
      refetchDonut()
      refetchGoals()
    } catch (error) {
      console.error('Erro no refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      onRefresh()
    }, [])
  );

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ff0000', '#00ff00', '#0000ff']}
          />
        } style={{ backgroundColor: isDarkMode ? "rgb(26, 26, 26)" : "#c6ebe9" }}>

        <VisaoGeral
          saldo={(balanceAccount?.saldo_total || 0)}
          balanco_geral={(balanceAccount?.balanco_geral || 0)}
          despesa={(balanceAccount?.despesa || 0)}
          receita={(balanceAccount?.receita || 0)}
        >
          {/* <View style={{ flexDirection: 'row', alignSelf: 'center', gap: 5 }}>
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
          </View> */}
        </VisaoGeral>
        <Wrapper>
          {/* 
          <WidgetTeste
            Color={isDarkMode ? "#2e2e2e" : "#fff"}
            Title={"Orçamento"}
            TextColor={isDarkMode ? "#e9e9e9" : "#3a3a3a"}
            hide
          >
            {budgetData ? (
              <>
                <Budget data={budgetData} />
              </>
            ) : (
              <>
                <CreateItem
                  text={'Nenhum Orçamento ativo neste mês.'}
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
                    isPrimary={item.is_primary}
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
                    {saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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

          </WidgetTeste> */}

          <WidgetTeste
            Color={isDarkMode ? "#2e2e2e" : "#ffffff"}
            Title={"Transações"}
            TextColor={isDarkMode ? "#e9e9e9" : "#3a3a3a"}
            onPressDetails={() => navigation.navigate('Transações')}
          >
            {recentTransactions?.length > 0 ? (
              recentTransactions?.map((item, index) => (
                <TransactionCard
                  key={item.id}
                  transaction={item}
                  state={isDarkMode}
                  hideOption={false}
                />
              ))
            ) : (
              <>
                <CreateItem
                  text={'Nenhuma transação encontrada.'}
                  buttonText={'Criar Transação'}
                  onPress={() => setShowTransactionModal(true)}
                  icon={
                    <TransactionEmpty color={isDarkMode ? "#AAA" : "#000000"} width={96} height={96} />
                  }
                />
              </>
            )
            }
          </WidgetTeste>

          {/* <WidgetTeste
            Color={isDarkMode ? "#2e2e2e" : "#ffffff"}
            Title={"Gráficos"}
            TextColor={isDarkMode ? "#e9e9e9" : "#3a3a3a"}
            onPressDetails={() => navigation.navigate('Gráficos')}
          >
            <TouchableOpacity onPress={() => navigation.navigate('Gráficos')} >
              {donutData && <PieChart height={350} width={350} data={donutData} total={total} padAngle={3} selected={selectedItem} />}
            </TouchableOpacity>
          </WidgetTeste>
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
          </WidgetTeste> */}
        </Wrapper>

      </ScrollView >
      <CreateTransaction
        isOpen={showTransactionModal}
        setIsOpen={() => setShowTransactionModal(false)}
      />
    </>
  );
}

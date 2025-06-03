import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ProgressBar from './progressbar';
import { Circle } from 'react-native-progress';
import { colorContext } from '@context/colorScheme';
import { useContext, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import DeleteButton from './deleteButton';
import { useToast } from 'react-native-toast-notifications';
import ActionButtons from '@components/actionButtons';
import DangerModal from '@components/dangerModal';
import { useBudgetAuth } from '@context/budgetsContext'

const Budget = ({ data }) => {
    const toast = useToast();
    const progress = (data.quantia_gasta ?? 0) / (data.limite ?? 1);
    const navigation = useNavigation()
    const { deleteBudgetMutation, refetchBudget } = useBudgetAuth();
    const [visible, setVisible] = useState(false)
    const { isDarkMode } = useContext(colorContext)
    const gasto_moeda = (data?.quantia_gasta || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    const limite_moeda = (data?.limite || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    const categorias = Object.keys(data?.limites_categorias ?? {});
    const limite_categorias = categorias.map((categoria) => ({
        categoria,
        limite: data?.limites_categorias?.[categoria] ?? 0,
        gasto: data?.quantia_gasta_categorias?.[categoria] ?? 0,
    }));


    const handleDelete = (data) => {
        if (!data?.id) {
            toastError('Erro: ID do orçamento não encontrado.');
            return;
        }

        deleteBudgetMutation.mutate(data?.id, {
            onSuccess: () => refetchBudget().then(() => toastSuccess()),
            onError: () => { toastError('Erro ao deletar orçamento.'); }
        });
    };

    const toastSuccess = () => {
        toast.show('Orçamento deletado com sucesso', {
            type: 'success',
            duration: 2500,
        });
        setVisible(false)
    }

    const toastError = (text) => {
        toast.show(`${text}`, {
            type: 'error',
            duration: 2500,
        });
    }

    return (
        <>
            <View style={[styles.container]}>
                {data?.desc_budget && (<Text style={[styles.desc, { color: isDarkMode ? '#DDD' : '#383838' }]}>{data?.desc_budget}</Text>)}
                <View style={styles.container}>
                    <Circle
                        unfilledColor={isDarkMode ? "#494949" : "#d6d6d6"}
                        borderWidth={0}
                        size={225}
                        thickness={20}
                        direction={'clockwise'}
                        color={(progress < 0.60) ? 'teal' : "#f5b237"}
                        progress={progress}
                        animated={true}
                        strokeCap="round"
                    />
                    <View style={styles.overlay}>
                        <Text style={[styles.valueText, { color: isDarkMode ? '#ececec' : '#1C3B3A' }]}>{gasto_moeda}</Text>
                        <Text style={[styles.totalText, { color: isDarkMode ? '#aab0b6' : '#6C757D' }]}>{limite_moeda}</Text>
                    </View>
                </View>
            </View>
            <View >
                {limite_categorias &&
                    (
                        <>
                            {limite_categorias.map(({ categoria, gasto, limite }, index) => (
                                <ProgressBar
                                    key={index}
                                    data={(gasto / limite)}
                                    size={350}
                                    label={categoria}
                                    value={'R$' + gasto + '/' + limite}
                                    unfilledColor={isDarkMode ? "#494949" : "#d6d6d6"}
                                    textColor={isDarkMode ? '#e6e6e6' : '#282c30'}
                                    event={() => console.log('teste')}
                                />

                            )
                            )}
                        </>
                    )
                }
                <View style={[styles.viewAlert, { backgroundColor: isDarkMode ? '#3d3d3d' : '#fff', borderColor: isDarkMode ? '#202020' : '#ccc' }]}>
                    {data?.quantia_gasta < data?.limite * 0.6 ? (
                        <Text style={[styles.textAlert, { color: isDarkMode ? '#ddd' : '#111' }]}>
                            Você está controlando bem seus gastos! Ainda há margem dentro do seu orçamento.
                        </Text>
                    ) : data?.quantia_gasta < data?.limite * 0.9 ? (
                        <Text style={[styles.textAlert, { color: isDarkMode ? '#ddd' : '#111' }]}>
                            Atenção: você já utilizou mais de 60% do seu orçamento. Considere ajustar seus gastos.
                        </Text>
                    ) : (
                        <Text style={[styles.textAlert, { color: isDarkMode ? '#ddd' : '#111' }]}>
                            Alerta: você já ultrapassou 90% do seu orçamento. É recomendável interromper novos gastos.
                        </Text>
                    )}

                </View>
                <View style={{ flexDirection: 'row', gap: 16, alignSelf: 'flex-end' }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Edit Budget', { data: data })}
                        style={[styles.button, { backgroundColor: isDarkMode ? '#919090' : '#cfcfcf' }]}
                    >
                        <Text style={styles.buttonEdit}>Editar</Text>
                    </TouchableOpacity>

                    <DeleteButton visible={visible} setVisible={() => setVisible(true)}>
                        <DangerModal
                            open={visible}
                            setOpen={setVisible}
                            onPress={() => handleDelete(data)}
                        />
                    </DeleteButton>
                </View>

            </View>
        </>
    )
}

export default Budget

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    desc: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 16,
        maxWidth: '80%',
    },
    overlay: {
        position: 'absolute',
        alignItems: 'center',
    },
    valueText: {
        fontSize: 24,
        fontWeight: 'bold',

    },
    totalText: {
        fontSize: 16,
        fontWeight: '600',
    },
    button: {
        padding: 10,
        paddingHorizontal: 30,
        elevation: 3,
        borderRadius: 5,
        marginTop: 16,
        marginBottom: 16,
    },
    buttonEdit: {
        fontSize: 16,
        fontWeight: '500'
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 30,
        textAlign: 'center'
    },
    viewAlert: { borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 24, marginBottom: 12 },
    textAlert: { fontSize: 16, fontWeight: '500', textAlign: 'justify', lineHeight: 20 }
})
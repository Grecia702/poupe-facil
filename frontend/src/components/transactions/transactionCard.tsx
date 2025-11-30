import { TouchableOpacity, View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import { format } from 'date-fns';
import DangerModal from '@components/dangerModal';
import { Dropdown } from "@components/dropdown";
import { DropdownItem } from "@components/dropdownItem";
import { useDropdown } from "@hooks/useDropdown";
import { getCategoryIcon } from "@utils/getCategoryIcon";
import { useTransactionActions } from "@hooks/useTransactionActions";
import type { Transaction } from "@shared/types/transaction";

interface TransactionCardProps {
    transaction: Transaction,
    isDarkMode: boolean,
    hideOption: boolean
}

export default function TransactionCard({ transaction, isDarkMode, hideOption }: TransactionCardProps) {
    const {
        id,
        nome_transacao,
        id_contabancaria,
        categoria,
        natureza,
        recorrente,
        data_transacao,
        valor,
        tipo
    } = transaction ?? {}
    const dropdown = useDropdown();
    const actions = useTransactionActions(id)
    const color = transaction?.tipo === 'Despesa' ? '#bb6464ff' : "#00ccbbff"

    const handleEditClick = () => {
        actions.handleEdit(transaction)
        dropdown.close();
    }

    const handleDeleteClick = () => {
        actions.handleDelete()
        dropdown.close();
    }

    return (
        <>
            <Dropdown
                isVisible={dropdown.isVisible}
                position={dropdown.position}
                onClose={dropdown.close}
                isDarkMode={isDarkMode}
            >
                <DropdownItem onPress={handleEditClick} isDarkMode={isDarkMode}>
                    Editar
                </DropdownItem>
                <DropdownItem onPress={handleDeleteClick} isDarkMode={isDarkMode}>
                    Excluir
                </DropdownItem>
            </Dropdown>
            <DangerModal
                open={actions.isDeleteModalOpen}
                setOpen={actions.closeDeleteModal}
                onPress={actions.handleDelete}
            />
            <View style={{ marginTop: 10, paddingBottom: 10, borderBottomWidth: hideOption ? 0 : 1, borderColor: isDarkMode ? '#dddddd8f' : '#7a7a7a8f' }}>

                <View style={styles.container}>
                    <View style={[styles.iconCard, { backgroundColor: color }]}>
                        <MaterialIcons
                            name={getCategoryIcon(tipo, categoria) as any}
                            color="white"
                            size={28}
                        />
                    </View>
                    <View style={styles.info}>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.title, { color: isDarkMode ? "#f1f1f1" : "#2e2e2e" }]}>{nome_transacao}</Text>
                                {recorrente && (
                                    <MaterialIcons
                                        name='repeat'
                                        color={isDarkMode ? "#EEE" : "#222"}
                                        size={20}
                                    />
                                )}
                            </View>
                            <Text style={[styles.text, { color: isDarkMode ? "#e9e7e7" : "#4e4e4e" }]}>{categoria} - {tipo}</Text>
                            <Text style={[styles.text, { color: isDarkMode ? "#e9e7e7" : "#4e4e4e" }]}>{id_contabancaria} - {format(data_transacao, 'dd/MM/yyyy')}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.value, { color: isDarkMode ? '#FFF' : '#303131', }]}>
                                {valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </Text>
                            {!hideOption && (
                                <TouchableOpacity ref={dropdown.buttonRef} onPress={dropdown.toggle}>
                                    <MaterialIcons name="more-vert" size={24} color={isDarkMode ? "white" : "black"} />
                                </TouchableOpacity>
                            )
                            }
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdown: {
        position: 'absolute',
        top: 0,
        width: 100,
        right: 25,
        elevation: 10,
        borderRadius: 5,
        zIndex: 4,
    },
    iconCard: {
        borderRadius: 30,
        height: 48,
        width: 48,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontWeight: '500',
        fontSize: 14,
        marginRight: 5,

    },
    value: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'right',
    },
    text: {
        fontSize: 12,
        fontWeight: 400
    },
})
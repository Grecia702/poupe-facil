import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

const FiltersTransactions = ({
    isDarkMode,
    isOpen,
    toggleDropdown,
    sortOptions,
    filterOptions,
    selectedFilterOption,
    setSelectedFilterOption,
    handleFilter,
    filtrosChips,
    removeFiltro,
    handleSort,
    clearFilters,
}) => {
    const [fields, setFields] = useState({ value_less_than: '', value_greater_than: '' })
    const categoriasDisponiveis = [
        { label: 'Contas', value: 'Contas' },
        { label: 'Alimentação', value: 'Alimentação' },
        { label: 'Transporte', value: 'Transporte' },
        { label: 'Saúde', value: 'Saude' },
        { label: 'Educação', value: 'Educação' },
        { label: 'Compras', value: 'Compras' },
        { label: 'Lazer', value: 'Lazer' },
        { label: 'Internet', value: 'Internet' },
        { label: 'Outros', value: 'Outros' },
    ];

    const datasDisponiveis = [
        { type: 'date', label: 'Hoje', value: 1, queryLabel: 'data_transacao' },
        { type: 'date', label: 'Ontem', value: 1, queryLabel: 'data_transacao' },
        { type: 'date', label: 'Ultimos 7 Dias', value: 7, queryLabel: 'data_transacao' },
        { type: 'date', label: 'Este Mês', value: 30, queryLabel: 'data_transacao' },
        { type: 'date', label: 'Este Trimestre', value: 90, queryLabel: 'data_transacao' },
        { type: 'date', label: 'Este Ano', value: 365, queryLabel: 'data_transacao' },
    ];
    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        })
    }
    const handleChange = (fieldName, text) => {
        const clean = text.replace(/\D/g, '')
        const valor = parseFloat(clean) / 100
        setFields(prev => ({
            ...prev,
            [fieldName]: isNaN(valor) ? 0 : valor,
        }))
    }

    return (
        <>
            {isOpen.sort && (
                <View style={[styles.dropdown, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
                    {sortOptions.map((option, index) => (
                        <TouchableOpacity key={index} style={styles.item} onPress={() => handleSort(option)}>
                            <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {isOpen.filters && (
                <View style={[styles.dropdown, { right: 65, backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
                    {filterOptions.map((option, index) => (
                        <View key={index}>
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => {
                                    if (selectedFilterOption === option.value) {
                                        setSelectedFilterOption(null);
                                    } else {
                                        setSelectedFilterOption(option.value);
                                    }
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ color: isDarkMode ? '#fff' : '#333', marginRight: 4 }}>
                                        {option.label}
                                    </Text>
                                    <MaterialIcons
                                        name={selectedFilterOption === option.value ? 'expand-less' : 'expand-more'}
                                        size={20}
                                        color={isDarkMode ? '#fff' : '#333'}
                                    />
                                </View>
                            </TouchableOpacity>
                            {selectedFilterOption === option.value && option.value === 'value' && (
                                <View style={{ borderTopWidth: 1, borderColor: '#ccc' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 20 }}>
                                        <View
                                            style={[styles.item, { paddingLeft: 20 }]}
                                        >
                                            <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Menor que</Text>
                                        </View>
                                        <TextInput
                                            keyboardType="numeric"
                                            value={formatCurrency(fields.value_less_than || 0)}
                                            onChangeText={text => handleChange('value_less_than', text)}
                                            onBlur={() => handleFilter({ label: `Menor que ${fields.value_less_than}`, value: fields.value_less_than, type: 'less_than', queryLabel: 'valor_menor_que' })}
                                            placeholder="R$ 0,00"
                                            style={{
                                                padding: 2,
                                                color: isDarkMode ? '#fff' : '#000',
                                                textAlign: 'right',
                                                flexShrink: 1,
                                                maxWidth: 120,
                                            }}
                                            scrollEnabled={true}
                                            multiline={false}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 20 }}>
                                        <View
                                            style={[styles.item, { paddingLeft: 20 }]}
                                        >
                                            <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Maior que</Text>
                                        </View>
                                        <TextInput
                                            keyboardType="numeric"
                                            value={formatCurrency(fields.value_greater_than || 0)}
                                            onChangeText={text => handleChange('value_greater_than', text)}
                                            onBlur={() => handleFilter({ label: `Maior que ${fields.value_greater_than}`, value: fields.value_greater_than, type: 'greater_than', queryLabel: 'valor_maior_que' })}
                                            placeholder="R$ 0,00"
                                            style={{
                                                padding: 2,
                                                color: isDarkMode ? '#fff' : '#000',
                                                textAlign: 'right',
                                                flexShrink: 1,
                                                maxWidth: 120,
                                            }}
                                            scrollEnabled={true}
                                            multiline={false}
                                        />
                                    </View>
                                </View>
                            )}

                            {selectedFilterOption === option.value && option.value === 'date' && (
                                <View style={{ borderTopWidth: 1, borderColor: '#ccc' }}>
                                    {datasDisponiveis.map((data, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={[styles.item, { paddingLeft: 20 }]}
                                            onPress={() => handleFilter({ label: data.label, value: data.value, type: 'date', queryLabel: 'data_transacao' })}
                                        >
                                            <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>{data.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {selectedFilterOption === option.value && option.value === 'categories' && (
                                <View style={{ borderTopWidth: 1, borderColor: '#ccc' }}>
                                    {categoriasDisponiveis.map((categoria, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={[styles.item, { paddingLeft: 20 }]}
                                            onPress={() => handleFilter({ label: categoria.label, value: categoria.value, type: 'categoria', queryLabel: 'categoria' })}
                                        >
                                            <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>{categoria.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            )}
            <View style={[styles.header, { position: 'relative' }]}>
                <View style={styles.dropdownWrapper}>
                    <TouchableOpacity
                        onPressIn={() => toggleDropdown('filters')}
                        style={[styles.optionsButton, { borderColor: isDarkMode ? '#DDD' : '#111' }]}
                    >
                        <MaterialIcons name="filter-alt" size={24} color={isDarkMode ? '#DDD' : '#111'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPressIn={() => toggleDropdown('sort')}
                        style={[styles.optionsButton, { borderColor: isDarkMode ? '#DDD' : '#111' }]}
                    >
                        <MaterialIcons name="sort" size={24} color={isDarkMode ? '#DDD' : '#111'} />
                    </TouchableOpacity>
                </View>
                {filtrosChips.length > 0 && (
                    <>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDarkMode ? '#EEE' : '#08380e' }}>
                                Filtros Ativos:
                            </Text>
                            {filtrosChips.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={{ backgroundColor: '#508bc5', padding: 5 }}
                                    onPress={() => removeFiltro(item)}
                                >
                                    <Text style={{ color: 'white', fontSize: 14 }}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            onPress={clearFilters}
                            style={{ backgroundColor: '#c44343', alignSelf: 'flex-start', padding: 10, borderRadius: 5 }}
                        >
                            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Resetar Filtros!</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </>
    );
};

export default FiltersTransactions;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'column',
        gap: 15,
        marginBottom: 10,
        position: 'relative',
    },
    dropdownWrapper: {
        marginLeft: 20,
        flexDirection: 'row',
        alignSelf: 'flex-end',
        gap: 5,
    },
    dropdown: {
        position: 'absolute',
        top: 70,
        right: 20,
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        elevation: 5,
        width: 200,
        zIndex: 50,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionsButton: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 5,
        gap: 5,
        borderWidth: 2,
        borderRadius: 5,
    },
});

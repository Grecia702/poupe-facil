import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { format, subDays, subMonths } from 'date-fns'
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';

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
    resetFiltros,
    clearFilters,
}) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDateType, setSelectedDateType] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
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



    return (
        <>
            {isOpen.sort && (
                <View style={[styles.dropdown, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
                    {sortOptions.map((option, index) => (
                        <TouchableOpacity key={index} style={styles.item} onPress={() => resetFiltros(option)}>
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
                                    <TouchableOpacity
                                        style={[styles.item, { paddingLeft: 20 }]}
                                        onPress={() => handleFilter({ label: 'Menor que', value: 'before' })}
                                    >
                                        <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Menor que</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.item, { paddingLeft: 20 }]}
                                        onPress={() => handleFilter({ label: 'Maior que', value: 'after' })}
                                    >
                                        <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Maior que</Text>
                                    </TouchableOpacity>
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
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (event.type === 'set' && date) {
                            setSelectedDate(date);
                            handleFilter({
                                label: `${selectedDateType === 'before' ? 'Antes de' : 'Depois de'} ${format(date, 'dd/MM/yyyy')}`,
                                value: selectedDateType,
                                date,
                            });
                        }
                    }}
                />
            )}
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

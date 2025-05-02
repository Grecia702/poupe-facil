const calcularProximaOcorrencia = (dataTransacao, frequenciaRecorrencia) => {
    let proxima = new Date(dataTransacao);

    switch (frequenciaRecorrencia) {
        case 'diario':
            proxima.setDate(proxima.getDate() + 1);
            break;
        case 'semanal':
            proxima.setDate(proxima.getDate() + 7);
            break;
        case 'quinzenal':
            proxima.setDate(proxima.getDate() + 14);
            break;
        case 'mensal':
            proxima.setMonth(proxima.getMonth() + 1);
            break;
        case 'bimestral':
            proxima.setMonth(proxima.getMonth() + 2);
            break;
        case 'trimestral':
            proxima.setMonth(proxima.getMonth() + 3);
            break;
        case 'quadrimestral':
            proxima.setMonth(proxima.getMonth() + 4);
            break;
        case 'semestral':
            proxima.setMonth(proxima.getMonth() + 6);
            break;
        case 'anual':
            proxima.setFullYear(proxima.getFullYear() + 1);
            break;
        default:
            throw new Error('Frequência de recorrência inválida');
    }

    return proxima;
};

module.exports = { calcularProximaOcorrencia };

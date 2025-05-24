import { VictoryBar, VictoryAxis, VictoryChart, VictoryTheme, VictoryTooltip, VictoryStack } from 'victory-native';
import { Dimensions } from 'react-native';
import { startOfWeek, endOfWeek } from 'date-fns'

const BarChartComponent = ({ data, color }) => {
    const { width } = Dimensions.get('window');
    return (
        <>
            <VictoryChart theme={VictoryTheme.grayscale}
                width={width * 0.9}
                height={325}
                padding={{ left: 90, right: 40, bottom: 50, top: 70, }}
                domain={{ x: [0.5, 5.5] }}
            >
                <VictoryAxis
                    tickValues={data.map(item => item.date_interval)}
                    tickFormat={(t) => {
                        const date = new Date(t);
                        const inicio = startOfWeek(date, { weekStartsOn: 1 }).getDate()
                        const fim = endOfWeek(date, { weekStartsOn: 1 }).getDate()
                        const month = new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' }).format(date);
                        return `${inicio}-${fim}\n${month}\n`;
                    }}
                    style={{
                        tickLabels: { fontSize: 16, fill: color ? "#d1d1d1" : "#000000" },
                        axis: {
                            stroke: color ? '#686faa6a' : "#b4b4b4c7",
                            strokeWidth: 2,
                        },

                    }}
                />
                <VictoryAxis
                    dependentAxis
                    tickFormat={(t) => `R$ ${t.toLocaleString('pt-BR')}`}
                    style={{
                        grid: {
                            stroke: color ? '#686faa6a' : "#b4b4b48f",
                            strokeWidth: 2,
                        },
                        tickLabels: { fontSize: 16, fill: color ? "#d1d1d1" : "#000000" },
                        axis: { stroke: "none" },
                    }}
                />

                <VictoryStack offset={0} >
                    <VictoryBar
                        data={data}
                        x="date_interval"
                        y="despesa"
                        labels={({ datum }) => [
                            `Despesa: R$ ${datum.despesa.toLocaleString('pt-BR')}`,
                            `Receita: R$ ${datum.receita.toLocaleString('pt-BR')}`
                        ]}
                        activateData={true}
                        activateLabels={true}
                        barWidth={30}
                        cornerRadius={{ top: 4 }}
                        style={{
                            data: { fill: color ? "#882e2e" : "#cc4646" },
                            labels: { fontSize: 16, fill: "#000000" },
                        }}
                        labelComponent={
                            <VictoryTooltip
                                flyoutStyle={{
                                    fill: "#fff",
                                    stroke: "#ccc",
                                    strokeWidth: 1,
                                    shadowColor: "#000",
                                }}
                                style={{
                                    fill: "#333",
                                    fontSize: 16,
                                    fontWeight: "500",
                                }}
                                cornerRadius={6}
                                flyoutPadding={{ top: 10, bottom: 10, left: 15, right: 15 }}
                            />
                        }
                    // animate={{ duration: 500 }}
                    />
                    <VictoryBar
                        data={data}
                        x="date_interval"
                        y="receita"
                        labels={({ datum }) => [
                            `Despesa: R$ ${datum.despesa.toLocaleString('pt-BR')}`,
                            `Receita: R$ ${datum.receita.toLocaleString('pt-BR')}`
                        ]}
                        barWidth={30}
                        cornerRadius={{ top: 4 }}
                        style={{
                            data: {
                                fill: color ? "#258d48" : "#31c763"
                            },
                            labels: { fontSize: 16, fill: "#000000" },
                        }}
                        labelComponent={
                            <VictoryTooltip
                                flyoutStyle={{
                                    fill: "#fff",
                                    stroke: "#ccc",
                                    strokeWidth: 1,
                                    shadowColor: "#000",
                                }}
                                style={{
                                    fill: "#333",
                                    fontSize: 16,
                                    fontWeight: "500",
                                }}
                                cornerRadius={6}
                                flyoutPadding={{ top: 10, bottom: 10, left: 15, right: 15 }}
                            />
                        }
                    // animate={{ duration: 500 }}
                    />
                </VictoryStack>
            </VictoryChart>
        </>
    )
}

export default BarChartComponent

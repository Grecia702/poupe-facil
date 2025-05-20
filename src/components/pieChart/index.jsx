import { useContext } from "react";
import { View } from "react-native";
import { colorContext } from '@context/colorScheme';
import Svg from "react-native-svg";
import { VictoryPie, VictoryLabel, VictoryTooltip, Flyout } from "victory-native";

export default function PieChart({ data, total, selected, height, width, padAngle }) {
    const { isDarkMode } = useContext(colorContext)

    const categoriaCores = {
        Contas: "rgb(160, 48, 44)",
        Alimentação: "rgb(204, 118, 38)",
        Carro: "rgb(57, 184, 74)",
        Internet: "rgb(64, 155, 230)",
        Lazer: "rgb(114, 13, 109)",
        Educação: "rgb(68, 59, 90)",
        Compras: "rgb(148, 137, 37)",
        Outros: "rgb(83, 87, 83)",
    };

    const dadosFormatados = data?.length > 0
        ? data
        : [{ categoria: 'Sem dados', total: 1 }]

    const cores = data?.length > 0
        ? data.map(item => categoriaCores[item.categoria] || 'gray')
        : ['#ccc']

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Svg width={width} height={height} viewBox={`-20 -20 ${width + 40} ${height + 40}`} >
                <VictoryPie
                    standalone={false}
                    data={dadosFormatados}
                    x="categoria"
                    y="total"
                    width={width}
                    height={height}
                    labelRadius={(150 / 2) * 1.1}
                    innerRadius={(200 / 2) * 0.8}
                    labelComponent={
                        <VictoryTooltip renderInPortal={false}
                            active={({ datum }) => datum.categoria === selected ? true : false}
                            flyoutPadding={{ top: 5, bottom: 5, left: 10, right: 10 }}
                            centerOffset={({ datum }) => ({
                                x: -50,
                                y: -20,
                            })}
                            flyoutStyle={{
                                fill: isDarkMode ? '#3b3a3a' : '#4d84cc',
                                stroke: isDarkMode ? "#c7c5c5" : '#3f3f3f',
                            }}
                            flyoutComponent={
                                <Flyout cornerRadius={10} pointerLength={2}
                                />}
                            style={{ fill: isDarkMode ? "#c5c6c7" : '#f5f5f5', fontSize: 20, fontWeight: 500 }}
                        />
                    }
                    padAngle={padAngle}
                    style={{
                        data: {
                            fillOpacity: ({ datum }) => (datum.categoria === selected || selected === "") ? 1 : 0.5,
                            stroke: ({ datum }) => datum.categoria === selected ? categoriaCores[datum.categoria] : 'none',
                            strokeOpacity: 0.5,
                            strokeWidth: 10
                        },
                        labels: {
                            padding: 20,
                            fontSize: 18,
                            fill: isDarkMode ? '#cccecb' : "black",
                            fontWeight: "600",
                        }
                    }}
                    // animate={{ duration: 500 }}
                    labels={({ datum }) => `Total: ${datum.ocorrencias} `}
                    colorScale={cores}
                />
                <VictoryLabel
                    textAnchor="middle"
                    verticalAnchor="middle"
                    style={{ fontSize: 24, fill: isDarkMode ? "#ebeeee" : "#17132e", fontWeight: "bold" }}
                    text={`Total: \n${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                    x={width / 2}
                    y={height / 2}
                />
            </Svg>
        </View>
    )
}
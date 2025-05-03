import React, { useContext } from "react";
import { View } from "react-native";
import { colorContext } from '@context/colorScheme';
import Svg from "react-native-svg";
import { VictoryPie, VictoryLabel, VictoryTooltip } from "victory-native";

export default function PieChart({ data, total, selected, height, width }) {
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

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Svg width={width} height={height} viewBox={`-20 -20 ${width + 40} ${height + 40}`} >
                <VictoryPie
                    standalone={false}
                    data={data}
                    x={data.x}
                    width={width}
                    height={height}
                    labelRadius={(150 / 2) * 1.1}
                    innerRadius={(200 / 2) * 0.8}
                    padAngle={3}
                    style={{
                        data: {
                            fillOpacity: ({ datum }) => (datum.x === selected || selected === "") ? 1 : 0.5,
                            stroke: ({ datum }) => datum.x === selected ? categoriaCores[datum.x] : 'none',
                            strokeOpacity: 0.5,
                            strokeWidth: 10
                        },
                        labels: {
                            display: ({ datum }) => datum.x === selected ? 'inline' : 'none',
                            padding: 20,
                            fontSize: 18,
                            fill: isDarkMode ? '#cccecb' : "black",
                            fontWeight: "600",
                        }
                    }}
                    animate={{ duration: 500 }}
                    labels={({ datum }) => `Quantidade: ${Math.round(datum.z)} `}
                    colorScale={data.map((item) => categoriaCores[item.x])}
                />
                <VictoryLabel
                    textAnchor="middle"
                    verticalAnchor="middle"
                    style={{ fontSize: 24, fill: isDarkMode ? "#ebeeee" : "#17132e", fontWeight: "bold" }}
                    text={`Total: \nR$${Number(total).toFixed(2)}`}
                    x={width / 2}
                    y={height / 2}
                />
            </Svg>
        </View>
    )
}
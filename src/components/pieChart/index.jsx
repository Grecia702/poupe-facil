import { useContext, useMemo } from "react";
import { View } from "react-native";
import { colorContext } from '@context/colorScheme';
import Svg from "react-native-svg";
import { VictoryPie, VictoryLabel, VictoryTooltip, Flyout } from "victory-native";
import { categoriaCores } from "@utils/categoriasCores";

export default function PieChart({ data, total, selected, height, width, padAngle }) {
    const { isDarkMode } = useContext(colorContext)
    const dadosFormatados = useMemo(() => {
        if (!data || data.length === 0) return [{ categoria: 'Sem dados', total: 1 }]
        return data.map(item => ({ ...item }))
    }, [data, total])



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
                            stroke: ({ datum }) =>
                                datum.categoria !== 'Sem dados' && datum.categoria === selected
                                    ? categoriaCores[datum.categoria]
                                    : 'none',
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
                    // animate={{ duration: 300, easing: "linear" }}
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
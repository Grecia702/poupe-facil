import React, { useContext } from "react";
import { colorContext } from '../../../context/colorScheme';
import Svg from "react-native-svg";
import { VictoryPie, VictoryLabel } from "victory-native";
import { CATEGORIAS } from '../../utils/categorias'
import { View } from "./styles";

export default function PieChart({ data, total, selected, height, width }) {
    const { isDarkMode } = useContext(colorContext)

    function findColor(props) {
        return CATEGORIAS.find(({ label }) => label === props).color
    }

    return (
        <View>
            <Svg width={width} height={height} viewBox={`0 0 ${height} ${width}`}>
                <VictoryPie
                    standalone={false}
                    data={data}
                    x="label"
                    y="value"
                    width={width}
                    height={height}
                    innerRadius={(width / 2) * 0.8}
                    labelRadius={100}
                    padAngle={3}
                    style={{
                        data: {
                            fillOpacity: ({ datum }) => (datum.label === selected || selected === "") ? 1 : 0.5,
                            stroke: ({ datum }) => datum.label === selected ? findColor(datum.label) : 'none',
                            strokeOpacity: 0.5,
                            strokeWidth: 10
                        },
                        labels: {
                            display: "none",
                            fontSize: 16,
                            fill: "black",
                            fontWeight: "600",
                        }
                    }}
                    animate={{ duration: 500, easing: "quadInOut" }}
                    colorScale={data.map((item) => findColor(item.label))}
                />
                <VictoryLabel
                    textAnchor="middle"
                    verticalAnchor="middle"
                    style={{ fontSize: 20, fill: isDarkMode ? "#ebeeee" : "#090522", fontWeight: "bold" }}
                    text={`Total: \nR$${total}`}
                    x={width / 2}
                    y={height / 2}
                />
            </Svg>
        </View>
    )
}
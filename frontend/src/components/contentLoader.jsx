import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { useContext, } from 'react'
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { colorContext } from '@context/colorScheme'

const CustomLoader = ({ radius, priceWidth, rectWidth, rectHeight, width, height }) => {

    const { isDarkMode } = useContext(colorContext);
    return (
        <View style={{ flex: 1, backgroundColor: isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E' }}>
            <View style={[styles.Container, { backgroundColor: isDarkMode ? "#2e2e2e" : "#ffffffd5" }]}>
                <View style={{ position: 'relative', width: '100%', height: height }}>
                    <View style={{ position: 'relative', width: '100%', height: height, pointerEvents: 'none' }}>
                        <ContentLoader
                            speed={0.8}
                            width={width}
                            height={height}
                            viewBox={`0 0 ${width} ${height}`}
                            backgroundColor={isDarkMode ? "#333" : "#bcecc0"}
                            foregroundColor={isDarkMode ? "#444" : "#a0d4a4"}
                        >
                            {Array.from({ length: 16 }).map((_, index) => (
                                <Rect
                                    key={`rect-left-${index}`}
                                    x="60"
                                    y={60 + index * 55}
                                    rx="5"
                                    ry="5"
                                    width={rectWidth}
                                    height={rectHeight + 15}
                                />
                            ))}

                            {Array.from({ length: 16 }).map((_, index) => (
                                <Rect
                                    key={`rect-right-${index}`}
                                    x={width - 130}
                                    y={65 + index * 55}
                                    rx="5"
                                    ry="5"
                                    width={priceWidth + 30}
                                    height={rectHeight}
                                />
                            ))}

                            {Array.from({ length: 13 }).map((_, index) => (
                                <Circle
                                    key={`circle-${index}`}
                                    cx="25"
                                    cy={80 + index * 55}
                                    r={radius}
                                />
                            ))}

                        </ContentLoader>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default CustomLoader

const styles = StyleSheet.create({
    Container: {
        minHeight: '100%',
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        paddingHorizontal: 15,
        paddingTop: 30,
        position: 'relative'

    },
})
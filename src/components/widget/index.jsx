import { SectionTitle } from "./styles";
import { Text, View, StyleSheet } from "react-native";

export default function WidgetTeste({ Color, Title, TextColor, children, align, onPressDetails }) {
    return (
        <View style={[styles.widget, { backgroundColor: Color }]}>
            <View style={styles.title}>
                <SectionTitle color={TextColor}>{Title}</SectionTitle>
                <Text
                    onPress={onPressDetails}
                    style={{ alignSelf: 'flex-end', textDecorationLine: 'underline', color: TextColor }}
                >
                    Ver mais
                </Text>
            </View>

            <View style={{ alignItems: align }} >
                {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    widget: {
        height: 'auto',
        flexDirection: 'column',
        borderRadius: 25,
        padding: 15,
        marginTop: 20,
        justifyContent: 'space-between',
        elevation: 3,
    },
    title: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        marginBottom: 32
    },
})
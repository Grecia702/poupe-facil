import { SectionTitle, WidgetViewTeste } from "./styles";

export default function WidgetTeste({ Color, Text, TextColor, children, direction, gap }) {
    return (
        <WidgetViewTeste gap={gap} direction={direction} color={Color}>
            <SectionTitle color={TextColor}>{Text}</SectionTitle>
            {children}
        </WidgetViewTeste>
    )
}
import styled from "styled-components/native";

export const Header = styled.View`
    width: 100%;
    height: auto;
    background-color: ${({ color }) => color}; 
    padding: 20px;
    gap: 20px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
`;

export const Title = styled.Text`
    font-size: 32px;
    font-weight: bold;
    color: white;
`;

export const Widget = styled.TouchableOpacity`
    background-color: 	${({ color }) => color};
    width: 150px;
    height: auto;
    border-width: 2px;
    border-color: ${({ border }) => border};
    border-radius: 15px;
    flex-direction: column;
    align-items: center;
    padding: 10px;
`;

export const ViewIcon = styled.View`
    width: 32px;
    height: 32px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-width: 2px;
    border-color: ${({ color }) => color};
    border-radius: 10px;
`;

// export const TextInfo = styled.Text`
//     font-size: 18px;
//     color: #1E293B;
// `;

export const TextInfo = styled.Text`
    color: ${({ color }) => color};
    font-weight: ${({ fontWeight }) => fontWeight};
    font-size: ${({ size }) => size};
`;

export const PlannedInfo = styled(TextInfo)`
    color: #1E293B;
`;



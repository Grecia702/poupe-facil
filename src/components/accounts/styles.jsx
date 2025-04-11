import styled from "styled-components";

export const AccountCard = styled.TouchableOpacity`
    flex-direction: row;
    width: 100%;
    align-items: center;
`;

export const IconCard = styled.View`
    background-color: ${({ color }) => color};
    border-radius: 20px; 
    height: 36px; 
    width: 36px; 
    margin-right: 10px;
    justify-content: center; 
    align-items: center; 
`;

export const InfoView = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
`;

export const Title = styled.Text`
    font-weight: 500;
    font-size: 16px;
    color: ${({ color }) => color};
    text-align: left;
`;

export const Balance = styled(Title)`
    font-weight: bold;
    font-size: 16px;
`;

export const Separator = styled.View`
    height: 1px;
    width: 100%;
    background-color:  ${({ isDarkMode }) => (isDarkMode ? '#7a7a7a86' : '#00000073')};
`;
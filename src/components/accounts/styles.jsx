import styled from "styled-components";

export const AccountCard = styled.TouchableOpacity`
    position: relative;
    flex-direction: row;
    width: 100%;
    margin-bottom: 10px;
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
    justify-content: flex-end
`;

export const TextContainer = styled.View`
    width: 200px;
    flex-direction: row;
    align-items: center;
    gap: 8px
`;

export const Title = styled.Text`
    font-weight: 500;
    font-size: 16px;
    color: ${({ color }) => color};
`;

export const Balance = styled(Title)`
    font-weight: bold;
    font-size: 16px;
`;

export const Separator = styled.View`
    height: 1px;
    width: 100%;
    margin-top: 10px;
    background-color: ${({ color }) => color};
`;
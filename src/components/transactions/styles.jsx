import styled from "styled-components";

export const WidgetView = styled.View`
    width: 100%;
    height: auto;
    background-color: ${({ color }) => color};
    border-radius: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
    position: relative;
`;

export const SectionTitle = styled.Text`
    font-size: 24px; 
    font-weight: 600;
    text-decoration: underline;
    color:  ${({ $state }) => ($state ? "#FFF" : "#48c7c7")};
    margin-bottom: 20px; 
`;

export const CardTransaction = styled.View`
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
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
 width: 220px;
 
`;

export const Title = styled.Text`
    font-weight: 500;
    font-size: 14px;
    color: ${({ $state }) => ($state ? "#f1f1f1" : "#2e2e2e")};
`;
export const Date = styled(Title)`
    font-size: 12px;
    font-weight: 400;
    color: ${({ $state }) => ($state ? "#e9e7e7" : "#4e4e4e")};
`;

export const Value = styled(Title)`
    font-size: 16px;
    font-weight: 600;
    width: 80px;
    text-align: right;
    color:  ${({ $state }) => ($state ? "#FFF" : "#303131")};
`;
import styled from "styled-components";

export const Modal = styled.View`
    flex: 1; 
    justify-content: center; 
    align-items: center; 
    background-color: rgba(121, 115, 115, 0.5);
`;

export const ViewModal = styled.View`
 width: 350px; 
 height: 500px; 
 background-color: white; 
 border-radius: 10px; 
 padding: 20px; 
`;

export const TouchableOpacity = styled.TouchableOpacity`
    width: auto;
    height: auto;
    padding: 10px;
    background-color: ${({ color = 'red' }) => color};
    align-self: flex-end;

`;

export const TextModal = styled.Text`
    color: white;
    font-size: 18px;
    font-weight: bold;
`;

export const Text = styled.Text`
    font-size: 16px;
`;

export const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 10px;
`;

export const TextInput = styled.TextInput`
    padding: 20px;
    border-width: 1px;
    border-color: black;
    border-radius: 5px;
    font-size: 16px;
    background-color: 'grey';
`;

export const Categorias = styled.View`
    margin-top: 20px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 15px;
`;

export const Filtro = styled.TouchableOpacity`
    padding: 10px;
    border-left-width: 10px;
    background-color: #e2e2e2;
    border-left-color: ${({ color }) => color};
    /* background-color:${({ color }) => color}; */
`;

export const List = styled.FlatList`
`;
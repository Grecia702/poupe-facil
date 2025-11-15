import styled from "styled-components";

export const Modal = styled.View`
    flex: 1; 
    justify-content: center; 
    align-items: center; 
    background-color: rgba(121, 115, 115, 0.5);
`;

export const ViewModal = styled.ScrollView`
 width: 350px;  
 max-height: 500px;
 flex-wrap: wrap;
 flex-direction: column;
 background-color: white; 
 border-radius: 10px; 
 padding: 20px; 
`;

export const TouchableOpacity = styled.TouchableOpacity`
    width: auto;
    height: auto;
    padding: 10px;
    background-color: ${({ selected, color }) => (selected ? color : "rgb(218, 218, 218)")};
    align-self: flex-end;
`;

export const ActiveFilters = styled(TouchableOpacity)`
    width: auto;
    height: auto;
    padding: 10px;
    background-color: ${({ color }) => color};
    
`;

export const ActiveText = styled.Text`
    font-size: 18px;
    font-weight: 500;
    color: ${({ color }) => color};
`;

export const TextModal = styled.Text`
    color: white;
    font-size: 18px;
    font-weight: bold;
`;

export const Text = styled.Text`
    font-size: 16px;
    color: ${({ selected, color }) => (selected ? color : "rgb(27, 27, 27)")};
`;

export const Title = styled.Text`
    font-size: 20px;
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
    flex-direction: row;
    align-items: center;
    background-color: #e2e2e2;
    height: 40px;
    padding-right: 10px;
    background-color: ${({ selected, color }) => (selected ? color : "rgb(218, 218, 218)")};
    border-left-color: ${({ color }) => color};
`;

export const Tag = styled.View`
  width: 8px;
  height: 100%;
  margin-right: 10px;
  background: ${({ color }) => color};
`;

export const Categoria = styled.Text`
    color: ${({ selected }) => (selected ? "white" : "black")};
    font-size: ${({ selected }) => (selected ? "18px" : "16px")};
    font-weight: ${({ selected }) => (selected ? "bold" : "500")};
`;

export const List = styled.FlatList`
`;

export const SearchButton = styled.TouchableOpacity`
    width: auto;
    height: auto;
    padding: 10px;
    background-color: ${({ color = 'red' }) => color};
    margin-top: 20px;
    margin-bottom: 50px;
    align-self: flex-end;
`;
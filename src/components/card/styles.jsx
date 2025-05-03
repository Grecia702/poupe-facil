import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  flex-direction: row;
  margin-bottom: 16px;
  align-items: center;
  overflow: hidden;
  position: relative;
  background-color:${({ color }) => color};
  border-width: ${({ selected }) => (selected ? "4px" : "0px")};
  border-color: ${({ selected, color }) => (selected ? color : "transparent")};
`;
export const Tag = styled.View`
  width: 10px;
  height: 100%;
  margin-right: 16px;
  background: ${({ color }) => color};
`;
export const Title = styled.Text`
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: ${({ color }) => color};
`;

export const Text = styled.Text`
  margin-right: 20px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ color }) => color};
`;

export const SubText = styled.Text`
  position: absolute;
  margin-right: 20px;
  font-size: 14px;
  font-weight: 500;
  top: 65%;
  right: 0;
  color:' ${({ color }) => color}';
`;

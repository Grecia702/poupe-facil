import styled from 'styled-components/native';


export const Wrapper = styled.View`
  padding: 10px;
  gap: 15px;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ color }) => color};
`;

export const TextParagraph = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ color }) => color};
`;

export const DropDown = styled.View`
  width: 370px;
  height: 50px;
`;

export const Temp = styled.View`
  gap: 5px;
  margin-bottom: 20px;
  margin-top: 20px;
`;
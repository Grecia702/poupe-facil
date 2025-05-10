import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  flex-direction: row;
  margin-bottom: 20px;
  align-items: center;
  overflow: hidden;
  position: relative;
  background-color: ${({ isPressed, color, background }) => (isPressed ? color : background)};
  border-width: ${({ isPressed }) => (isPressed ? "4px" : "0px")};
  border-color: ${({ isPressed, color }) => (isPressed ? color : 'color')};
`;
export const Tag = styled.View`
  width: 10px;
  height: 100%;
  margin-right: 16px;
  background-color: ${({ color }) => color};
`;
export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ color, isPressed }) => (isPressed ? '#FFF' : color)};
  margin-right: 15px;
`;

// export const Text = styled.Text`
//   margin-right: 20px;
//   font-size: 18px;
//   font-weight: 600;
//   color: ${({ color }) => color};
// `;


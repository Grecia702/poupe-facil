import styled from "styled-components";


// export const WidgetViewTeste = styled.View`
//     height: auto;
//     flex-direction: column;
//     background-color: ${({ color }) => color};
//     border-radius: 25px;
//     padding: 15px;
//     margin-top: 20px;
//     justify-content: space-between; 
//     flex-wrap: wrap;
//     elevation: 3;
// `;

export const SectionTitle = styled.Text`
    font-size: 24px; 
    font-weight: 600;
    text-decoration: underline;
    color:  ${({ color }) => color};

`;

export const StyledScroll = styled.ScrollView.attrs(() => ({
    contentContainerStyle: {
        paddingVertical: 10,

    },
}))``;

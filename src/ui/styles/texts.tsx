import styled from "styled-components/native";

export const RegularText = styled.Text`
	${(props) => props.theme.fonts.regular};
`;

export const MediumText = styled.Text`
	${(props) => props.theme.fonts.medium};
`;

export const BoldText = styled.Text`
	${(props) => props.theme.fonts.bold};
`;

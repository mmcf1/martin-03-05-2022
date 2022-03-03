import styled from "styled-components/native";

export const Separator = styled.View<{ color?: string }>`
	width: 100%;
	height: 1px;
	background-color: ${(props) => props.color ?? props.theme.colors.weakText};
`;

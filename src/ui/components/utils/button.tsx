import React from "react";
import styled from "styled-components/native";
import { BoldText } from "../../styles/texts";

type ButtonProps = {
	title: string;
	backgroundColor?: string;
	onPress?: () => void;
};

export function Button(props: ButtonProps) {
	return (
		<Touchable backgroundColor={props.backgroundColor} onPress={props.onPress}>
			<Text>{props.title}</Text>
		</Touchable>
	);
}

const Touchable = styled.TouchableOpacity<{ backgroundColor?: string }>`
	padding: 12px 22px;
	background-color: ${(props) => props.backgroundColor};
	border-radius: 8px;
`;

const Text = styled(BoldText)`
	color: ${(props) => props.theme.colors.text};
`;

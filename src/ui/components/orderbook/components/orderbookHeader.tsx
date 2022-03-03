import React from "react";
import styled from "styled-components/native";
import { RegularText } from "../../../styles/texts";
import { Row } from "../../utils/row";
import { Separator } from "../../utils/separator";

export function OrderbookHeader() {
	return (
		<Container>
			<Separator />
			<StyledRow>
				<Text>{"PRICE"}</Text>
				<Text>{"SIZE"}</Text>
				<Text>{"TOTAL"}</Text>
			</StyledRow>
			<Separator />
		</Container>
	);
}

const Container = styled.View``;

const StyledRow = styled(Row)`
	padding: 8px;
`;

const Text = styled(RegularText)`
	flex-grow: 1;
	flex-basis: 0;
	color: ${(props) => props.theme.colors.weakText};
	text-align: center;
`;

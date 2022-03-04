import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components/native";
import { Orderbook } from "../../../../domain/orderbook/orderbook";
import { BoldText } from "../../../styles/texts";
import { Row } from "../../utils/row";

type OrderbookSpreadViewProps = {
	orderbook: Orderbook;
};

export const OrderbookSpreadView = observer((props: OrderbookSpreadViewProps) => {
	const spread = props.orderbook.spread ?? "";
	return (
		<Container>
			<Text>{"Spread: " + spread}</Text>
		</Container>
	);
});

const Container = styled(Row)`
	align-items: center;
	justify-content: center;
	padding: 10px;
`;

const Text = styled(BoldText)`
	font-size: 15px;
	color: ${(props) => props.theme.colors.weakText};
`;

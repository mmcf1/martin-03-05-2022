import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components/native";
import { Orderbook } from "../../../domain/orderbook/orderbook";
import { OrderbookHeader } from "./components/orderbookHeader";
import { OrderbookSideView } from "./components/orderbookSideView";
import { OrderbookSpreadView } from "./components/orderbookSpreadView";

type OrderbookViewProps = {
	orderbook: Orderbook;
};

export const OrderbookView = observer((props: OrderbookViewProps) => {
	return (
		<Container>
			<OrderbookHeader />
			<SidesContainer>
				<OrderbookSideView orderbookSide={props.orderbook.buySide} />
				<OrderbookSpreadView orderbook={props.orderbook} />
				<OrderbookSideView orderbookSide={props.orderbook.sellSide} />
			</SidesContainer>
		</Container>
	);
});

const Container = styled.View`
	flex-grow: 1;
`;

const SidesContainer = styled.View`
	flex-grow: 1;
	flex-basis: 0;
`;

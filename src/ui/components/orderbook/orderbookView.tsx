import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import styled from "styled-components/native";
import { ObservableOrderbook } from "../../../domain/orderbook/orderbook";
import { ObservableOrderbookSideVisualizer } from "../../../domain/orderbook/orderbookSideVisualizer";
import { OrderbookHeader } from "./components/orderbookHeader";
import { OrderbookSideView } from "./components/orderbookSideView";
import { OrderbookSpreadView } from "./components/orderbookSpreadView";

type OrderbookViewProps = {
	orderbook: ObservableOrderbook;
};

export const OrderbookView = observer((props: OrderbookViewProps) => {
	const buySide = useMemo(() => new ObservableOrderbookSideVisualizer(props.orderbook.buySide), [props.orderbook]);
	const sellSide = useMemo(() => new ObservableOrderbookSideVisualizer(props.orderbook.sellSide), [props.orderbook]);

	return (
		<Container>
			<OrderbookHeader />
			<SidesContainer>
				<OrderbookSideView orderbookSide={buySide} />
				<OrderbookSpreadView orderbook={props.orderbook} />
				<OrderbookSideView orderbookSide={sellSide} />
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

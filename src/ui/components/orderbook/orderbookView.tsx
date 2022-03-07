import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components/native";
import { ObservableOrderbook } from "../../../domain/orderbook/orderbook";
import { BoldText, RegularText } from "../../styles/texts";
import { Row } from "../utils/row";
import { Spacer } from "../utils/spacer";
import { OrderbookBottomBar } from "./components/orderbookBottomBar";
import { OrderbookGroupingToggle } from "./components/orderbookGroupingToggle";
import { OrderbookHeader } from "./components/orderbookHeader";
import { OrderbookSideView } from "./components/orderbookSideView";
import { OrderbookSpreadView } from "./components/orderbookSpreadView";

type OrderbookViewProps = {
	orderbook: ObservableOrderbook;
};

export const OrderbookView = observer((props: OrderbookViewProps) => {
	return (
		<Container>
			<TitleRow>
				<Title>{"Order book"}</Title>
				<ProductInfosText>{`(${props.orderbook.activeProduct.displayName})`}</ProductInfosText>
				<Spacer />
				<OrderbookGroupingToggle orderbook={props.orderbook} />
			</TitleRow>
			<OrderbookHeader />
			<SidesContainer>
				<OrderbookSideView orderbookSide={props.orderbook.buySide} />
				<OrderbookSpreadView orderbook={props.orderbook} />
				<OrderbookSideView orderbookSide={props.orderbook.sellSide} />
				<OrderbookBottomBar toggleFeed={props.orderbook.toggleActiveProduct} killFeed={props.orderbook.killFeed} />
			</SidesContainer>
		</Container>
	);
});

const Container = styled.View`
	flex-grow: 1;
`;

const TitleRow = styled(Row)`
	align-items: center;
	margin: 8px 12px;
`;

const Title = styled(BoldText)`
	color: ${(props) => props.theme.colors.text};
	font-size: 18px;
`;

const ProductInfosText = styled(RegularText)`
	color: ${(props) => props.theme.colors.weakText};
	font-size: 14px;
	margin-left: 15px;
`;

const SidesContainer = styled.View`
	flex-grow: 1;
	flex-basis: 0;
`;

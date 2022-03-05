import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components/native";
import { Orderbook } from "../../../../domain/orderbook/orderbook";
import { BoldText, RegularText } from "../../../styles/texts";
import { useFormatPrice } from "../../priceLevel/hooks/useFormatPrice";
import { Row } from "../../utils/row";

type OrderbookSpreadViewProps = {
	orderbook: Orderbook;
};

export const OrderbookSpreadView = observer((props: OrderbookSpreadViewProps) => {
	const formattedBid = useFormatPrice(props.orderbook.bid);
	const formattedSpread = useFormatPrice(props.orderbook.spread);
	const formattedAsk = useFormatPrice(props.orderbook.ask);
	return (
		<Container>
			<BidAskText>{`(${formattedBid})`}</BidAskText>
			<Text>{"Spread: " + formattedSpread}</Text>
			<BidAskText>{`(${formattedAsk})`}</BidAskText>
		</Container>
	);
});

const Container = styled(Row)`
	align-items: center;
	justify-content: space-evenly;
	padding: 10px;
`;

const BidAskText = styled(RegularText)`
	font-size: 12px;
	color: ${(props) => props.theme.colors.weakText};
`;

const Text = styled(BoldText)`
	font-size: 15px;
	color: ${(props) => props.theme.colors.weakText};
`;

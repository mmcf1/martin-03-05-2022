import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { StatusBar } from "react-native";
import styled from "styled-components/native";
import { ObservableOrderbook } from "../../domain/orderbook/orderbook";
import { OrderbookView } from "../components/orderbook/orderbookView";
import { Row } from "../components/utils/row";
import { BoldText, RegularText } from "../styles/texts";

export const OrderbookScreen = observer(() => {
	const orderbook = useMemo(() => new ObservableOrderbook(), []);
	return (
		<Root>
			<SafeAreaView>
				<StatusBar barStyle={"light-content"} />
				<TitleRow>
					<Title>{"Order book"}</Title>
					<Product>{`(${orderbook.activeProduct.displayName})`}</Product>
				</TitleRow>
				<OrderbookView orderbook={orderbook} />
			</SafeAreaView>
		</Root>
	);
});

const Root = styled.View`
	flex-grow: 1;
	background-color: ${(props) => props.theme.colors.background};
`;

const SafeAreaView = styled.SafeAreaView`
	flex: 1;
`;

const TitleRow = styled(Row)`
	align-items: baseline;
	margin-left: 8px;
	margin-top: 12px;
	margin-bottom: 12px;
`;

const Title = styled(BoldText)`
	color: ${(props) => props.theme.colors.text};
	font-size: 18px;
`;

const Product = styled(RegularText)`
	color: ${(props) => props.theme.colors.weakText};
	font-size: 14px;
	margin-left: 15px;
`;

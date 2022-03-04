import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { StatusBar } from "react-native";
import styled from "styled-components/native";
import { ObservableOrderbook } from "../../domain/orderbook/orderbook";
import { OrderbookView } from "../components/orderbook/orderbookView";
import { BoldText } from "../styles/texts";

export const OrderbookScreen = observer(() => {
	const orderbook = useMemo(() => new ObservableOrderbook(), []);
	return (
		<Root>
			<SafeAreaView>
				<StatusBar barStyle={"light-content"} />
				<Title>{"Order book"}</Title>
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

const Title = styled(BoldText)`
	color: ${(props) => props.theme.colors.text};
	font-size: 18px;
	margin-left: 8px;
	margin-top: 12px;
	margin-bottom: 12px;
`;

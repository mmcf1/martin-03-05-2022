import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { StatusBar } from "react-native";
import styled from "styled-components/native";
import { ObservableOrderbook } from "../../domain/orderbook/orderbook";
import { ObservableOrderbookFeed } from "../../domain/orderbook/orderbookFeed";
import { OrderbookView } from "../components/orderbook/orderbookView";

const XBT_ETH_Feed = () =>
	new ObservableOrderbookFeed([
		{ id: "PI_XBTUSD", displayName: "XBTUSD", groupings: [0.5, 1, 2.5] },
		{ id: "PI_ETHUSD", displayName: "ETHUSD", groupings: [0.05, 0.1, 0.25] },
	]);

export const OrderbookScreen = observer(() => {
	const orderbook = useMemo(() => new ObservableOrderbook(XBT_ETH_Feed()), []);
	return (
		<Root>
			<SafeAreaView>
				<StatusBar barStyle={"light-content"} />
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

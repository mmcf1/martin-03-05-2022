import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { StatusBar } from "react-native";
import styled from "styled-components/native";
import { ObservableOrderbook } from "../../domain/orderbook/orderbook";
import { OrderbookView } from "../components/orderbook/orderbookView";

export const OrderbookScreen = observer(() => {
	const orderbook = useMemo(() => new ObservableOrderbook(), []);
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

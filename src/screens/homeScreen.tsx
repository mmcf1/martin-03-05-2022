import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { ObservableOrderbook } from "../domain/orderbook/orderbook";
import { OrderbookSide } from "../domain/orderbook/orderbookSide";

export const HomeScreen = observer(() => {
	const orderbook = useMemo(() => new ObservableOrderbook(), []);

	return (
		<SafeAreaView>
			<StatusBar />
			<ScrollView contentInsetAdjustmentBehavior="automatic">
				<OrderbookSideView orderbookSide={orderbook.buySide} />
				<OrderbookSideView orderbookSide={orderbook.sellSide} />
			</ScrollView>
		</SafeAreaView>
	);
});

const OrderbookSideView = observer((props: { orderbookSide: OrderbookSide }) => {
	return (
		<View style={{ marginTop: 150 }}>
			{props.orderbookSide.priceLevels.map((level) => (
				<Text key={level.price}>{level.price + " --- " + level.amount}</Text>
			))}
		</View>
	);
});

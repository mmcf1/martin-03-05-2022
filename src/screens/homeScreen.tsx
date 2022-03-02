import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { ObservableOrderbook } from "../domain/orderbook/orderbook";
import { OrderbookSide } from "../domain/orderbook/orderbookSide";
import { ObservableOrderbookSideVisualizer } from "../domain/orderbook/orderbookSideVisualizer";

export const HomeScreen = observer(() => {
	const orderbook = useMemo(() => new ObservableOrderbook(), []);
	const buySideVisualizer = useMemo(() => new ObservableOrderbookSideVisualizer(orderbook.buySide), [orderbook.buySide]);
	const sellSideVisualizer = useMemo(() => new ObservableOrderbookSideVisualizer(orderbook.sellSide), [orderbook.sellSide]);

	return (
		<SafeAreaView>
			<StatusBar />
			<ScrollView contentInsetAdjustmentBehavior="automatic">
				<Text>{"Grouping : " + buySideVisualizer.grouping}</Text>
				<View style={{ flexDirection: "row" }}>
					<OrderbookSideView orderbookSide={buySideVisualizer} />
					<Spacer />
					<OrderbookSideView orderbookSide={orderbook.buySide} />
				</View>
				<View style={{ flexDirection: "row" }}>
					<OrderbookSideView orderbookSide={sellSideVisualizer} />
					<Spacer />
					<OrderbookSideView orderbookSide={orderbook.sellSide} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
});

const Spacer = () => <View style={{ flexGrow: 1 }} />;

const OrderbookSideView = observer((props: { orderbookSide: OrderbookSide }) => {
	return (
		<View style={{ marginTop: 150 }}>
			{props.orderbookSide.priceLevels.map((level) => (
				<Text key={level.price}>{level.price + " --- " + level.amount}</Text>
			))}
		</View>
	);
});

import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { Button, SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
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
				<Button
					title={"+"}
					onPress={() => {
						buySideVisualizer.updateGrouping(buySideVisualizer.grouping * 2);
						sellSideVisualizer.updateGrouping(sellSideVisualizer.grouping * 2);
					}}
				/>
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
			<Text>{"Total : " + props.orderbookSide.totalAmount}</Text>
			{props.orderbookSide.priceLevels.map((level, index) => (
				<Text key={level.price}>{level.price + " --- " + level.amount + " : " + props.orderbookSide.priceLevelsWithTotalAmount[index].amount}</Text>
			))}
		</View>
	);
});

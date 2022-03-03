import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { StatusBar } from "react-native";
import styled from "styled-components/native";
import { ObservableOrderbook } from "../../domain/orderbook/orderbook";
import { OrderbookView } from "../components/orderbook/orderbookView";
import { ScreenScrollView } from "../components/utils/screenScrollView";
import { BoldText } from "../styles/texts";

export const OrderbookScreen = observer(() => {
	const orderbook = useMemo(() => new ObservableOrderbook(), []);
	return (
		<Root>
			<SafeAreaView>
				<StatusBar barStyle={"light-content"} />
				<ScreenScrollView alwaysBounceVertical={false}>
					<Title>{"Order book"}</Title>
					<OrderbookView orderbook={orderbook} />
				</ScreenScrollView>
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

/*

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

*/

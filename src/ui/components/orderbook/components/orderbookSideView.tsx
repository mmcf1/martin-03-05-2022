import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components/native";
import { OrderbookSide } from "../../../../domain/orderbook/orderbookSide";
import { Side } from "../../../../domain/side/side";
import { PriceLevelView } from "../../priceLevel/priceLevelView";
import { SideProvider } from "../../side/sideProvider";

type OrderbookSideViewProps = {
	orderbookSide: OrderbookSide;
};

export const OrderbookSideView = observer((props: OrderbookSideViewProps) => {
	return (
		<Container side={props.orderbookSide.side}>
			<SideProvider side={props.orderbookSide.side}>
				{props.orderbookSide.priceLevels.map((priceLevel, index) => (
					<PriceLevelView
						key={priceLevel.price}
						priceLevel={priceLevel}
						priceLevelTotalSize={props.orderbookSide.priceLevelsWithTotalSize[index].size}
						bookSize={props.orderbookSide.bookSize}
					/>
				))}
			</SideProvider>
		</Container>
	);
});

const Container = styled.View<{ side: Side }>``;

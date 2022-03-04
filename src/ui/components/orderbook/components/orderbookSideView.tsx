import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components/native";
import { OrderbookSide } from "../../../../domain/orderbook/orderbookSide";
import { Side } from "../../../../domain/side/side";
import { colorWithOpacity } from "../../../styles/colors";
import { PriceLevelView } from "../../priceLevel/priceLevelView";
import { useSideColor } from "../../side/hooks/useSideColor";
import { SideProvider } from "../../side/sideProvider";

type OrderbookSideViewProps = {
	orderbookSide: OrderbookSide;
};

export const OrderbookSideView = observer((props: OrderbookSideViewProps) => {
	const side = props.orderbookSide.side;
	const color = useSideColor(side);
	const backgroundColor = colorWithOpacity(color, 0.1);
	return (
		<ScrollView backgroundColor={backgroundColor} contentContainerStyle={contentContainerStyle} alwaysBounceVertical={false}>
			<PriceLevelContainer side={side}>
				<SideProvider side={side}>
					{props.orderbookSide.priceLevels.map((_, i, levels) => {
						const index = side === "sell" ? i : levels.length - 1 - i;
						const priceLevelTotalSize = props.orderbookSide.priceLevelsWithTotalSize[index].size;
						return <PriceLevelView key={levels[index].price} priceLevel={levels[index]} priceLevelTotalSize={priceLevelTotalSize} bookSize={props.orderbookSide.size} />;
					})}
				</SideProvider>
			</PriceLevelContainer>
		</ScrollView>
	);
});

const ScrollView = styled.ScrollView<{ backgroundColor: string }>`
	flex: 1;
	background-color: ${(props) => props.backgroundColor};
`;

const contentContainerStyle = {
	flexGrow: 1,
};

const PriceLevelContainer = styled.View<{ side: Side }>`
	flex-grow: 1;
	justify-content: ${(props) => (props.side === "buy" ? "flex-end" : "flex-start")};
`;

import { observer } from "mobx-react";
import React, { useMemo } from "react";
import styled from "styled-components/native";
import { PriceLevel, Size } from "../../../domain/priceLevel/priceLevel";
import { colorWithOpacity } from "../../styles/colors";
import { BoldText } from "../../styles/texts";
import { useSide } from "../side/hooks/useSide";
import { useSideColor } from "../side/hooks/useSideColor";
import { Row } from "../utils/row";
import { useFormatPrice } from "./hooks/useFormatPrice";
import { useFormatSize } from "./hooks/useFormatSize";

type PriceLevelViewProps = {
	priceLevel: PriceLevel;
	priceLevelTotalSize: Size;
	orderbookSideSize: Size;
};

export const PriceLevelView = observer((props: PriceLevelViewProps) => {
	const side = useSide();
	const color = useSideColor(side);

	const depthViewColor = useMemo(() => colorWithOpacity(color, 0.2), [color]);

	const price = useFormatPrice(props.priceLevel.price);
	const size = useFormatSize(props.priceLevel.size);
	const totalSize = useFormatSize(props.priceLevelTotalSize);

	return (
		<Container>
			<DepthView color={depthViewColor} levelTotalSize={props.priceLevelTotalSize} bookSize={props.orderbookSideSize} />
			<TextContainer>
				<Price color={color}>{price}</Price>
			</TextContainer>
			<TextContainer>
				<LevelSize>{size}</LevelSize>
			</TextContainer>
			<TextContainer>
				<TotalSize>{totalSize}</TotalSize>
			</TextContainer>
		</Container>
	);
});

const Container = styled(Row)``;

const DepthView = styled.View<{ color: string; levelTotalSize: Size; bookSize: Size }>`
	position: absolute;
	height: 100%;
	width: ${(props) => (props.levelTotalSize / props.bookSize) * 100}%;
	background-color: ${(props) => props.color};
`;

const TextContainer = styled.View`
	flex-grow: 1;
	flex-basis: 0;
	align-items: center;
	padding-top: 5px;
	padding-bottom: 5px;
`;

const Text = styled(BoldText)`
	color: ${(props) => props.theme.colors.text};
`;

const Price = styled(Text)<{ color: string }>`
	color: ${(props) => props.color};
`;

const LevelSize = styled(Text)``;

const TotalSize = styled(Text)``;

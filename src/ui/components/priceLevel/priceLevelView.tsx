import { observer } from "mobx-react";
import React, { useMemo } from "react";
import styled from "styled-components/native";
import { PriceLevel } from "../../../domain/priceLevel/priceLevel";
import { colorWithOpacity } from "../../styles/colors";
import { BoldText } from "../../styles/texts";
import { useSideColor } from "../side/hooks/useSideColor";
import { Row } from "../utils/row";

type PriceLevelViewProps = {
	priceLevel: PriceLevel;
	priceLevelTotalSize: number;
	bookSize: number;
};

export const PriceLevelView = observer((props: PriceLevelViewProps) => {
	const color = useSideColor();
	const depthViewColor = useMemo(() => colorWithOpacity(color, 0.2), [color]);
	return (
		<Container>
			<DepthView color={depthViewColor} levelTotalSize={props.priceLevelTotalSize} bookSize={props.bookSize} />
			<TextContainer>
				<Price color={color}>{props.priceLevel.price}</Price>
			</TextContainer>
			<TextContainer>
				<Size>{props.priceLevel.size}</Size>
			</TextContainer>
			<TextContainer>
				<TotalSize>{props.priceLevelTotalSize}</TotalSize>
			</TextContainer>
		</Container>
	);
});

const Container = styled(Row)``;

const DepthView = styled.View<{ color: string; levelTotalSize: number; bookSize: number }>`
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

const Size = styled(Text)``;

const TotalSize = styled(Text)``;

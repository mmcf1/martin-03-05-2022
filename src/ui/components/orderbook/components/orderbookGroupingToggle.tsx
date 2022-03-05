import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components/native";
import { Orderbook } from "../../../../domain/orderbook/orderbook";
import { RegularText } from "../../../styles/texts";

type OrderbookGroupingToogleProps = {
	orderbook: Orderbook;
};

export const OrderbookGroupingToggle = observer((props: OrderbookGroupingToogleProps) => {
	return (
		<Button onPress={() => props.orderbook.toggleGrouping()}>
			<ButtonTitle>{`Group ${props.orderbook.grouping}`}</ButtonTitle>
		</Button>
	);
});

const Button = styled.TouchableOpacity`
	border-radius: 4px;
	padding: 6px 16px;
	background-color: ${(props) => props.theme.colors.weakText};
`;

const ButtonTitle = styled(RegularText)`
	font-size: 12px;
	color: ${(props) => props.theme.colors.text};
`;

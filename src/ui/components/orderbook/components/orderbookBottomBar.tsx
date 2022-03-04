import React from "react";
import styled, { useTheme } from "styled-components/native";
import { Button } from "../../utils/button";
import { Row } from "../../utils/row";

type OrderbookBottomBarProps = {
	toggleFeed: () => void;
	killFeed: () => void;
};

export function OrderbookBottomBar(props: OrderbookBottomBarProps) {
	const theme = useTheme();
	return (
		<Container>
			<Button title={"Toggle Feed"} onPress={props.toggleFeed} backgroundColor={theme.colors.cta} />
			<Button title={"Kill Feed"} onPress={props.killFeed} backgroundColor={theme.colors.stop} />
		</Container>
	);
}

const Container = styled(Row)`
	justify-content: space-around;
	padding: 20px;
`;

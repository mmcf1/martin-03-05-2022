import React from "react";
import styled from "styled-components/native";
import { Product } from "../../../domain/product/product";
import { RegularText } from "../../styles/texts";

type ProductButtonProps = {
	product: Product;
	isActive: boolean;
	onPress: () => void;
};

export function ProductButton(props: ProductButtonProps) {
	return (
		<Touchable disabled={props.isActive} onPress={props.onPress}>
			<Text>{props.product.displayName}</Text>
		</Touchable>
	);
}

const Touchable = styled.TouchableOpacity`
	border-radius: 7px;
	padding: 10px;
`;

const Text = styled(RegularText)`
	color: ${(props) => props.theme.colors.text};
`;

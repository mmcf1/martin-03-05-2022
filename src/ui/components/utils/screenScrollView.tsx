import React from "react";
import { ScrollViewProps } from "react-native";
import styled from "styled-components/native";

export const ScreenScrollView = (props: ScrollViewProps) => {
	return (
		<StyledScrollView alwaysBounceVertical={false} keyboardShouldPersistTaps={"handled"} contentContainerStyle={[contentContainerStyle, props.contentContainerStyle]}>
			{props.children}
		</StyledScrollView>
	);
};

const StyledScrollView = styled.ScrollView`
	flex: 1;
`;

const contentContainerStyle = {
	flexGrow: 1,
};

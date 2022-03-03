import { Platform } from "react-native";
import { CSSObject } from "styled-components";

export type Fonts = {
	[Property in FontWeight]: CSSObject;
};

export type FontWeight = "regular" | "medium" | "bold";

const platformFont: { [key in "ios" | "android"]: Fonts } = {
	ios: {
		regular: {
			fontFamily: "Helvetica Neue",
		},
		medium: {
			fontFamily: "HelveticaNeue-Medium",
		},
		bold: {
			fontFamily: "HelveticaNeue-Bold",
		},
	},
	android: {
		regular: {
			fontFamily: "Roboto",
		},
		medium: {
			fontFamily: "Roboto",
		},
		bold: {
			fontFamily: "Roboto",
		},
	},
};

export const fonts: Fonts = platformFont[Platform.OS === "ios" ? "ios" : "android"];

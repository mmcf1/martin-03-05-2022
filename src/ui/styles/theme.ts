import { DefaultTheme } from "styled-components/native";
import { Colors, colors } from "./colors";
import { Fonts, fonts } from "./fonts";

declare module "styled-components/native" {
	export interface DefaultTheme {
		colors: Colors;
		fonts: Fonts;
	}
}

export const theme: DefaultTheme = {
	colors: colors,
	fonts: fonts,
};

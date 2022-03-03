import { useTheme } from "styled-components";
import { useSide } from "./useSide";

export function useSideColor() {
	const side = useSide();
	const theme = useTheme();
	return side === "buy" ? theme.colors.buy : theme.colors.sell;
}

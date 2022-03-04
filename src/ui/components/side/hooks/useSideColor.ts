import { useTheme } from "styled-components";
import { Side } from "../../../../domain/side/side";

export function useSideColor(side: Side) {
	const theme = useTheme();
	return side === "buy" ? theme.colors.buy : theme.colors.sell;
}

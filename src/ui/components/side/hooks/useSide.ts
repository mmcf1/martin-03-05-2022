import { useContext } from "react";
import { Side } from "../../../../domain/side/side";
import { SideContext } from "../sideContext";

export function useSide(): Side {
	const side = useContext(SideContext);
	if (!side) {
		throw new Error("Side context not defined");
	}
	return side;
}

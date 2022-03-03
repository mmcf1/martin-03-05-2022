import { useContext } from "react";
import { Side } from "../../../../domain/side/side";
import { SideContext } from "../sideContext";

export function useSide(): Side | null {
	const context = useContext(SideContext);
	return context;
}

import React from "react";
import { Side } from "../../../domain/side/side";
import { SideContext } from "./sideContext";

type SideProviderProps = {
	side: Side;
	children?: React.ReactNode | JSX.Element;
};

export function SideProvider(props: SideProviderProps) {
	return <SideContext.Provider value={props.side}>{props.children}</SideContext.Provider>;
}

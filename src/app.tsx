import React from "react";
import { ThemeProvider } from "styled-components";
import { OrderbookScreen } from "./ui/screens/orderbookScreen";
import { theme } from "./ui/styles/theme";

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<OrderbookScreen />
		</ThemeProvider>
	);
};

export default App;

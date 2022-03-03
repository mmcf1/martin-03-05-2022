export interface Colors {
	background: string;
	text: string;
	weakText: string;
	buy: string;
	sell: string;
}

export const colors: Colors = {
	background: "#000000",
	text: "#f0f0f0",
	weakText: "#3d3d3d",
	buy: "#dd3c57",
	sell: "#519c59",
};

export function colorWithOpacity(color: string, opacity: number): string {
	const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
	return color + _opacity.toString(16).toUpperCase();
}

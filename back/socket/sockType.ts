export type SockCreateRoom = {
	name: string,
	speed: number,
	sizeTerrain: {
		sizeRow: number,
		sizeColumn: number
	},
}

export type SetName = {
	name: string;
}
export type SystemNetHttpHttpResponseMessage = {
	Version: string;
	Content: any;
	StatusCode: number;
	ReasonPhrase: string;
	Headers: Headers;
	RequestMessage: any;
	IsSuccessStatusCode: boolean;
};

import "@mui/material/styles";

declare module "@mui/material/styles" {
	interface Theme {
		custom: {
			background: {
				primary: string;
				secondary: string;
			};
			icon: {
				primary: string;
			};
		};
	}

	interface ThemeOptions {
		custom?: {
			background?: {
				primary?: string;
				secondary?: string;
			};
			icon?: {
				primary?: string;
			};
		};
	}
}

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				red: {
					"1": "#FF0000",
					"2": "#B51F1F"
				}
			},
		},
	},
	plugins: [],
}


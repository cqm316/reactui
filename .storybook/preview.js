import React from "react";
import { GlobalStyle } from "../src/components/shared/global.tsx";
import { addDecorator, addParameters } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
//let Global = GlobalStyle()
console.log(GlobalStyle)
addParameters({
	options: {
		showRoots: true,
	},
	dependencies: {
		withStoriesOnly: true,
		hideEmpty: true,
	},
});
addDecorator(withA11y);
addDecorator((story) => (
	<>
		<GlobalStyle />
		{story()}
	</>
));
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}
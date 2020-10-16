import React from "react";
import { DatePicker } from "./index";
import {
	withKnobs,
	text,
	boolean,
	color,
	select,
	number,
} from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";

export default {
	title: "DatePicker",
	component: DatePicker,
	decorators: [withKnobs],
};

export const knobsDatePicker = () => (
	<DatePicker
		callback={action("callback")}
		delay={number("delay", 2000)}
		initDate={text("initDate", "")}
	></DatePicker>
);
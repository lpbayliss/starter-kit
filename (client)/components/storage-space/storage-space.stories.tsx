import type { Meta, StoryObj } from "@storybook/react";

import StorageSpace from "./storage-space.component";

const meta = {
	title: "Library/StorageSpace",
	component: StorageSpace,
	parameters: {},
	tags: ["autodocs"],
	argTypes: {},
	args: {},
} satisfies Meta<typeof StorageSpace>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

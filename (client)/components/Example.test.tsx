import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("Link", () => {
	test("should do its thing", () => {
		render(<a href="/">Hello</a>);
		expect(screen.getByText("Hello")).toBeInTheDocument();
	});
});

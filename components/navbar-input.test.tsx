import { fireEvent, render } from "@testing-library/react";
import NavbarInput from "./navbar-input";

test("input should be focused after selecting mode", async () => {
    const rendered = render(<NavbarInput username="" />);
    const editButton = rendered.container.querySelector(".set-mode-icon");
    fireEvent.click(editButton!);
    const input = await rendered.findByPlaceholderText("Search");
    expect(input).toHaveFocus();
});

test("input should be cleared after selecting mode", async () => {
    const rendered = render(<NavbarInput username="" />);
    const input = await rendered.container.querySelector("input");
    fireEvent.change(input!, { target: { value: "abc def" } });
    const editButton = rendered.container.querySelector(".set-mode-icon");
    fireEvent.click(editButton!);
    expect(input).toHaveValue("");
});

import { fireEvent, render } from "@testing-library/react";
import NavbarInput from "./navbar-input";

test("input should be focused after pressing edit", async () => {
    const rendered = render(<NavbarInput username="" />);
    const editButton = rendered.container.querySelector(".set-mode-icon");
    fireEvent.click(editButton!);
    const input = await rendered.findByPlaceholderText("Search");
    expect(input).toHaveFocus();
});

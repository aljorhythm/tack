import TackItem from "./tack-item";
import { Tack } from "../pages/api/tack/types";
import { fireEvent, render } from "@testing-library/react";

test("displayed url should be shortened", async () => {
    const url = "https://www.whatever.com?abc=123&bcd=234";
    const tack: Tack = {
        url,
        userId: "",
        id: "",
        tags: [],
        created_at: new Date(),
        title: null,
    };
    const rendered = render(<TackItem tack={tack} />);
    const element = await rendered.findByText("https://www.whatever.com");
    expect(element).not.toBeNull();
    expect(element).toHaveAttribute("href", url);
});

test("edit tags input should be focused after pressing edit", async () => {
    const tack: Tack = {
        url: "",
        userId: "",
        id: "",
        tags: ["thisistheinputbox"],
        created_at: new Date(),
        title: null,
    };
    const rendered = render(<TackItem tack={tack} />);
    const editButton = rendered.getByRole("button", { name: /edit/ });
    fireEvent.click(editButton);
    const input = await rendered.findByDisplayValue("#thisistheinputbox");
    expect(input).toHaveFocus();
});

export {};

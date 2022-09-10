import TackItem from "./tack-item";
import { Tack } from "../pages/api/tack/types";
import { render } from "@testing-library/react";

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

export {};

import TackItem from "./tack-item";
import { Tack } from "../pages/api/tack/types";
import { act, fireEvent, render } from "@testing-library/react";
import api from "../pages/api/client";

describe("tack item", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

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

    test("edit tags input should submit on enter", async () => {
        const spyEditMyTag = jest.spyOn(api, "editMyTag").mockReturnValue(Promise.resolve(true));
        const tack: Tack = {
            url: "",
            userId: "",
            id: "",
            tags: ["thisistheinputbox"],
            created_at: new Date(),
            title: null,
        };
        jest.spyOn(api, "getMyTag").mockReturnValue(Promise.resolve(tack));

        const rendered = render(<TackItem tack={tack} />);
        const editButton = rendered.getByRole("button", { name: /edit/ });
        fireEvent.click(editButton);
        const input = await rendered.findByDisplayValue("#thisistheinputbox");

        await act(async () => {
            fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });
        });
        expect(spyEditMyTag).toHaveBeenCalledTimes(1);
    });
});

export {};

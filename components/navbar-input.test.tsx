import { act, fireEvent, render } from "@testing-library/react";
import exp from "constants";
import { query } from "express";
import api from "../pages/api/client";
import NavbarInput from "./navbar-input";

const mockQuery = jest.fn();

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: mockQuery(),
            asPath: "",
        };
    },
}));

describe("input area behaviors", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("input should be focused after selecting mode", async () => {
        const rendered = render(<NavbarInput username="" />);
        const editButton = rendered.container.querySelector(".set-mode-icon");
        await act(() => {
            fireEvent.click(editButton!);
        });
        const input = await rendered.findByPlaceholderText("Search");
        expect(input).toHaveFocus();
    });

    test("input should be cleared after selecting mode", async () => {
        const rendered = render(<NavbarInput username="" />);
        const input = await rendered.container.querySelector("input");
        await act(() => {
            fireEvent.change(input!, { target: { value: "abc def" } });
        });
        const editButton = rendered.container.querySelector(".set-mode-icon");
        fireEvent.click(editButton!);
        expect(input).toHaveValue("");
    });

    test("keypress enter in input should submit", async () => {
        const addTackSpy = jest.spyOn(api, "addTack").mockReturnValue(Promise.resolve(""));
        const rendered = render(<NavbarInput username="" />);
        const input = await rendered.container.querySelector("input");
        await act(() => {
            fireEvent.change(input!, { target: { value: "abc def" } });
        });

        await act(async () => {
            fireEvent.keyDown(input!, { key: "Enter", code: "Enter", charCode: 13 });
        });

        expect(addTackSpy).toHaveBeenCalledTimes(1);
    });

    test("mode should be search when query exists", async () => {
        mockQuery.mockReturnValue({ query: "abc" });
        const rendered = render(<NavbarInput username="" />);
        expect(rendered.getByRole("button", { name: /search/ })).toBeVisible();
    });
});

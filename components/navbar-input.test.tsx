import { act, fireEvent, render, waitForElementToBeRemoved } from "@testing-library/react";
import sleep from "sleep-promise";
import api from "../pages/api/client";
import { Command } from "./command";
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
        jest.useRealTimers();
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

    test("input should be focused on focus add command", async () => {
        const rendered = render(<NavbarInput username="" />);
        (await rendered.findByRole("button")).focus();
        expect(await rendered.findByRole("textbox")).not.toHaveFocus();

        await act(() => {
            document.dispatchEvent(
                new CustomEvent("tack_command", {
                    detail: { command: Command.focus_nav_add },
                }),
            );
        });

        expect(await rendered.findByRole("textbox")).toHaveFocus();
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

    test("submit on keypress enter in input, show loading and clear input on add", async () => {
        jest.useFakeTimers();
        jest.spyOn(api, "addTack").mockReturnValue(
            new Promise(async (resolve) => {
                await sleep(1000);
                resolve("");
            }),
        );
        const rendered = render(<NavbarInput username="" />);
        const input = await rendered.container.querySelector("input");
        await act(async () => {
            fireEvent.change(input!, { target: { value: "abc def" } });
            fireEvent.keyDown(input!, { key: "Enter", code: "Enter", charCode: 13 });
        });
        expect(await rendered.findByText("adding...")).toBeVisible();

        await act(async () => {
            jest.advanceTimersByTime(1100);
        });

        expect(rendered.queryByText("adding...")).toBeNull();
        expect(await rendered.container.querySelector("input")!).toHaveValue("");
    });

    test("mode should be search when query exists", async () => {
        mockQuery.mockReturnValue({ query: "abc" });
        const rendered = render(<NavbarInput username="" />);
        expect(rendered.getByRole("button", { name: /search/ })).toBeVisible();
    });
});

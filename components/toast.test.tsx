import { Toast } from "./toast";
import sleep from "sleep-promise";
import { RenderedResult } from "../test-helpers/testing-library";
import { act } from "react-dom/test-utils";
import { render } from "@testing-library/react";

test("should disappear after 2 seconds", async () => {
    let rendered: RenderedResult;

    await act(async () => {
        rendered = render(<Toast milliseconds={2000} message={"this is a toast"} id={123} />);
    });

    expect(await rendered!.findByText("this is a toast")).toBeVisible();
    await act(async () => {
        await sleep(2100);
    });
    expect(rendered!.queryByText("this is a toast")).toBeNull();
});

test("should not show if no time given", async () => {
    let rendered: RenderedResult;
    await act(async () => {
        rendered = render(<Toast milliseconds={0} message={"this is a toast"} id={0} />);
    });
    expect(rendered!.queryByText("this is a toast")).toBeNull();
});

export {};

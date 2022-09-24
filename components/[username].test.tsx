import { act, fireEvent, Queries, render, RenderResult, waitFor } from "@testing-library/react";
import { RenderedResult } from "../test-helpers/testing-library";
import Profile from "../pages/profile/[username]";
import Layout from "./layout";

describe("copy to clipboard", () => {
    test("should show toast", async () => {
        let rendered: RenderResult<Queries, HTMLElement, HTMLElement>;
        await act(() => {
            rendered = render(
                <Profile
                    key={null}
                    user={{
                        id: "",
                        email: "",
                        username: "",
                    }}
                    tacks={[]}
                />,
                {
                    wrapper: Layout,
                },
            );
        });
        for (const _ in Array.from({ length: 3 })) {
            await act(async () => {
                fireEvent.click(rendered!.container.querySelector(".copy-to-clipboard")!);
            });
            expect(await rendered!.findByText("copied to clipboard")).toBeVisible();
            await waitFor(async () => {
                expect(rendered!.queryByText("copied to clipboard")).toBeNull();
            });
        }
    });
});

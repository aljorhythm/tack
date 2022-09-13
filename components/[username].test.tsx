import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { RenderedResult } from "../test-helpers/testing-library";
import Profile from "../pages/profile/[username]";

describe("copy to clipboard", () => {
    test("should show toast", async () => {
        let rendered: RenderedResult;
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

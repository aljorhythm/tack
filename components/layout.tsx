import { EventHandler, useEffect } from "react";
import { Command } from "./command";
import Navbar from "./navbar";

function Footer() {
    return <div></div>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === "a") {
                document.dispatchEvent(
                    new CustomEvent("tack_command", {
                        detail: { command: Command.focus_nav_add },
                    }),
                );
                event.preventDefault();
                return false;
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, []);
    return (
        <div onKeyDown={(event) => {}} className="space-y-4">
            <Navbar />
            <main className="grid w-full">{children}</main>
            <Footer />
        </div>
    );
}

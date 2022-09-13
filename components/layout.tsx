import Navbar from "./navbar";
import Toast, { useToast } from "./toast";

function Footer() {
    return <div></div>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <Navbar />
            <main className="grid w-full">{children}</main>
            <Footer />
        </div>
    );
}

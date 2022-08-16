import Navbar from "./navbar";

function Footer() {
    return <div></div>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <Navbar />
            <main className="">{children}</main>
            <Footer />
        </div>
    );
}

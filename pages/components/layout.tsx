import Link from "next/link";

function Navbar() {
    return (
        <div>
            <Link href="/pieces">
                <a>Pieces</a>
            </Link>
        </div>
    );
}

function Footer() {
    return <div></div>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}

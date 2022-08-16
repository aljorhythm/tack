import Link from "next/link";
import styles from "../../styles/Home.module.css";

function Navbar() {
    return (
        <nav className="flex items-center justify-between flex-wrap bg-slate-50">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-xl tracking-tight text-black">Tack</span>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
                    <Link
                        className="block mt-4 lg:inline-block lg:mt-0 text-stale-200 hover:text-white mr-4"
                        href="/pieces"
                    >
                        <a>Pieces</a>
                    </Link>
                    <Link
                        className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
                        href="/pieces/search"
                    >
                        <a>Search</a>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

function Footer() {
    return <div></div>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.container}>
            <Navbar />
            <main className={styles.main}>{children}</main>
            <Footer />
        </div>
    );
}

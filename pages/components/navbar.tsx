import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="py-2 px-10 flex items-center justify-between flex-wrap bg-slate-50">
            <div className="flex items-center flex-shrink-0 text-white mr-10">
                <span className="font-semibold text-xl tracking-tight text-slate-600">Tack</span>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
                    <Link href="/pieces">
                        <a className="block mt-4 lg:inline-block lg:mt-0 text-stale-200 hover:text-white mr-5">
                            Pieces
                        </a>
                    </Link>
                    <Link href="/pieces/search">
                        <a className="block mt-4 lg:inline-block lg:mt-0 text-stale-200 hover:text-white mr-5">
                            Search
                        </a>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

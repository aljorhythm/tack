import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
    return (
        <div>
            <main>
                <Link href="/login">
                    <a className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
                        Login
                    </a>
                </Link>
                <Link href="/signup">
                    <a className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
                        Sign Up
                    </a>
                </Link>
            </main>
        </div>
    );
};

export default Home;

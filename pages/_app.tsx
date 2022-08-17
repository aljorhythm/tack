import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "./components/layout";
import Head from "next/head";
import { CookiesProvider } from "react-cookie";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <CookiesProvider>
            <Layout>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>
                <Component {...pageProps} />
            </Layout>
        </CookiesProvider>
    );
}

export default MyApp;

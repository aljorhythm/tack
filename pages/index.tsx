import { Piece } from "./api/piece/types";
import Pieces, { getServerSideProps as importedSSProps } from "./pieces";

export const getServerSideProps = importedSSProps;

type Props = {
    isLoggedIn: boolean;
    pieces: Array<Piece>;
};

export default function Index(args: Props) {
    const { isLoggedIn, pieces } = args;
    return <>{isLoggedIn ? <Pieces pieces={pieces} /> : <>Log in to view your pieces</>}</>;
}

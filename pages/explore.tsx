import { useRouter } from "next/router";
import { findUserById } from "./api/user/persistence";
import { PopularTag } from "./api/user/types";
import { getTackServerSideProps, TackServerSidePropsContext } from "./request";

type Props = {
    popularTags: PopularTag[];
};

const Explore = function ({ popularTags }: Props) {
    const router = useRouter();

    async function search(searchQuery: string) {
        router.push({ pathname: "/tacks/search", query: { query: searchQuery } });
    }

    return (
        <div className="lg:px-80">
            <span className="text-slate-800 font-bold text-lg">Your Popular Tags</span>

            <div className="popular-tags flex flex-wrap">
                {popularTags.map((popularTag) => {
                    return (
                        <div
                            onClick={() => search(popularTag.tag)}
                            key={popularTag.tag}
                            className="popular-tag hover:bg-slate-200 cursor-pointer flex justify-between lg:w-80 lg:h-30 m-4 rounded p-4 bg-slate-300"
                        >
                            <div className="font-bold tag">{popularTag.tag}</div>
                            <div className="count">{popularTag.count}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Explore;

export const getServerSideProps = getTackServerSideProps(
    async (context: TackServerSidePropsContext) => {
        const popularTags = await context.user?.getMyPopularTags();
        const props: Props = {
            popularTags: popularTags || [],
        };
        return { props };
    },
    findUserById,
);

import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filter/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";

const questions = [
    {
        _id: "1",
        title: "I want to learn React, can anyone help me?",
        tags: [
            { _id: "1", name: "React" },
            { _id: "2", name: "JavaScript" },
        ],
        author: {
            _id: "1",
            name: "John Doe",
            image: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740&q=80",
        },
        upvotes: 10,
        answers: 5,
        views: 87,
        createdAt: new Date("2021-09-02"),
    },
    {
        _id: "2",
        title: "I want to learn Next.js. Seriously",
        tags: [
            { _id: "1", name: "React" },
            { _id: "2", name: "JavaScript" },
            { _id: "3", name: "Next.js" },
        ],
        author: {
            _id: "1",
            name: "John Doe",
            image: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740&q=80",
        },
        upvotes: 10,
        answers: 5,
        views: 87,
        createdAt: new Date("2021-09-02"),
    },
];

// query='react
interface SearchParams {
    searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
    const { query = "", filter = "" } = await searchParams;

    const filterQuesitons = questions.filter((question) => {
        const matchesQuery = question.title
            .toLowerCase()
            .includes(query.toLowerCase());

        const matchesFilter = filter
            ? question.tags[0].name.toLowerCase() === filter.toLowerCase()
            : true;
        return matchesQuery && matchesFilter;
    });

    return (
        <>
            <section className="flex w-full flex-col-reverse gap-4 justify-between sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">All Questions</h1>
                <Button
                    className="primary-gradient min-h-11.5 px-4 py-3"
                    asChild
                >
                    <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
                </Button>
            </section>
            <section className="mt-11">
                <LocalSearch
                    route="/"
                    imgSrc="/icons/search.svg"
                    placeholder="Search questions ... "
                    otherClasses="flex-1"
                />
            </section>
            <HomeFilter />
            <div className="mt-10 flex w-full flex-col gap-6">
                {filterQuesitons.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                ))}
            </div>
        </>
    );
};

export default Home;

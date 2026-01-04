import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";

const questions = [
    {
        _id: "1",
        title: "I want to learn React, can anyone help me?",
        tags: [
            {
                _id: "1",
                name: "React",
            },
            {
                _id: "2",
                name: "JavaScript",
            },
        ],
        author: {
            _id: "1",
            name: "John Doe",
        },
        upvotes: 10,
        answers: 5,
        views: 87,
        createdAt: new Date(),
    },
    {
        _id: "2",
        title: "I want to learn Next.js, can anyone help me?",
        tags: [
            {
                _id: "1",
                name: "React",
            },
            {
                _id: "2",
                name: "JavaScript",
            },
        ],
        author: {
            _id: "1",
            name: "John Doe",
        },
        upvotes: 10,
        answers: 5,
        views: 87,
        createdAt: new Date(),
    },
    {
        _id: "3",
        title: "I want to learn HTML, can anyone help me?",
        tags: [
            {
                _id: "1",
                name: "React",
            },
            {
                _id: "2",
                name: "JavaScript",
            },
        ],
        author: {
            _id: "1",
            name: "John Doe",
        },
        upvotes: 10,
        answers: 5,
        views: 87,
        createdAt: new Date(),
    },
];

// query='react
interface SearchParams {
    searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
    const { query = "" } = await searchParams;

    // const { data } = await axios.get("/api/questions", {
    //     query: {search: query}
    // })

    const filterQuesitons = questions.filter((question) =>
        question.title.toLowerCase().includes(query?.toLowerCase())
    );

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
            <div className="mt-10 flex w-full flex-col gap-6">
                {filterQuesitons.map((questions) => (
                    <h1 key={questions._id}>{questions.title}</h1>
                ))}
            </div>
        </>
    );
};

export default Home;

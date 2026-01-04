"use client";
import { AskQuestionSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

const QuestionForm = () => {
    const form = useForm({
        resolver: zodResolver(AskQuestionSchema),
        defaultValues: {
            title: "",
            content: "",
            tags: [],
        },
    });

    const handleCreateQuestion = () => {};
    return (
        <Form {...form}>
            <form
                className="flex w-full flex-col gap-10"
                onSubmit={form.handleSubmit(handleCreateQuestion)}
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-medium text-dark400_light700">
                                Question Title{" "}
                                <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 border" />
                            </FormControl>
                            <FormDescription className="body-regular text-light-500 mt-2.5">
                                Be Specific and Imagine You are Asking a
                                Quesiton to Another
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-medium text-dark400_light700">
                                Detailed Explanation of Your Problem{" "}
                                <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>Editor</FormControl>
                            <FormDescription className="body-regular text-light-500 mt-2.5">
                                Introduce the Problem and Expand on What
                                you&apos;ve put in the Title
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormLabel className="paragraph-medium text-dark400_light700">
                                Tags <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <div>
                                    <Input
                                        className="paragraph-regular background-light900_dark300 
                                    light-border-2 text-dark300_light700 no-focus min-h-12 border"
                                        placeholder="Add tags..."
                                    />
                                </div>
                            </FormControl>
                            <FormDescription className="body-regular text-light-500 mt-2.5">
                                Add up to 3 Tags to Describe What Your Question
                                is About. You Need to Press Enter to Add a Tag
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="mt-16 flex justify-end">
                    <Button
                        type="submit"
                        className="primary-gradient w-fit !text-light-900"
                    >
                        {" "}
                        Ask A Question
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default QuestionForm;

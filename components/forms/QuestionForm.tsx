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
import { useRef, useTransition } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import TagCard from "../cards/TagCard";
import z from "zod";
import { toast } from "sonner";
import { createQuestion } from "@/lib/actions/question.action";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { ReloadIcon } from "@radix-ui/react-icons";

const Editor = dynamic(() => import("@/components/editor/Editor"), {
    ssr: false,
});

const QuestionForm = () => {
    const router = useRouter();
    const editorRef = useRef<MDXEditorMethods>(null);
    const [isPending, startTransition] = useTransition();
    const form = useForm({
        resolver: zodResolver(AskQuestionSchema),
        defaultValues: {
            title: "",
            content: "",
            tags: [],
        },
    });

    const handleCreateQuestion = async (
        data: z.infer<typeof AskQuestionSchema>
    ) => {
        startTransition(async () => {
            const result = await createQuestion(data);

            if (result.success) {
                toast.success("Success", {
                    description: "Question created seccessfully",
                    duration: 5000,
                    position: "top-right",
                });

                if (result.data) router.push(ROUTES.QUESTION(result.data?._id));
            } else {
                toast.error(`Error ${result?.status}`, {
                    description:
                        result?.error?.message || "Something went wrong.",
                    duration: 5000,
                    position: "top-right",
                });
            }
        });
    };

    const handleTagRemove = (tag: string, field: { value: string[] }) => {
        const newTags = field.value.filter((t) => t !== tag);

        form.setValue("tags", newTags);

        if (newTags.length === 0) {
            form.setError("tags", {
                type: "manual",
                message: "Tags are required",
            });
        }
    };

    const handleInputKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        field: { value: string[] }
    ) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const tagInput = e.currentTarget.value.trim();

            if (
                tagInput &&
                tagInput.length < 15 &&
                !field.value.includes(tagInput)
            ) {
                form.setValue("tags", [...field.value, tagInput]);
                e.currentTarget.value = "";
                form.clearErrors("tags");
            } else if (tagInput.length > 15) {
                form.setError("tags", {
                    type: "manual",
                    message: "Tag should be less than 15 characters",
                });
            } else if (field.value.includes(tagInput)) {
                form.setError("tags", {
                    type: "manual",
                    message: "Tag already exists",
                });
            }
        }
    };

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
                                <Input
                                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 border"
                                    {...field}
                                />
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
                            <FormControl>
                                <Editor
                                    value={field.value}
                                    editorRef={editorRef}
                                    fieldChange={field.onChange}
                                />
                            </FormControl>
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
                                        onKeyDown={(e) =>
                                            handleInputKeyDown(e, field)
                                        }
                                    />
                                    {field.value.length > 0 && (
                                        <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                                            {field.value.map((tag: string) => (
                                                <TagCard
                                                    key={tag}
                                                    _id={tag}
                                                    name={tag}
                                                    compact
                                                    remove
                                                    isButton
                                                    handleRemove={() =>
                                                        handleTagRemove(
                                                            tag,
                                                            field
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                    )}
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
                        disabled={isPending}
                        className="primary-gradient w-fit text-light-900!"
                    >
                        {isPending ? (
                            <>
                                <ReloadIcon className="mr-2 size-4 animate-spin" />
                                <span>Submitting</span>
                            </>
                        ) : (
                            <>Ask A Question</>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default QuestionForm;

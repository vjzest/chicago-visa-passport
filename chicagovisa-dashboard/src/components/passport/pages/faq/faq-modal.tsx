import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useEffect } from "react";
import { Loader } from "lucide-react";
import { formatName } from "@/lib/utils";

const FaqFormSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

type FaqFormValues = z.infer<typeof FaqFormSchema>;

interface FaqModalProps {
  onSubmit: (values: Omit<IFAQ, "_id">) => void;
  editingFaq: IFAQ | null;
}

const FaqModal: React.FC<FaqModalProps> = ({ onSubmit, editingFaq }) => {
  const form = useForm<FaqFormValues>({
    resolver: zodResolver(FaqFormSchema),
    defaultValues: editingFaq || { question: "", answer: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: FaqFormValues) => {
    await onSubmit(values);
    form.reset();
  };

  useEffect(() => {
    if (editingFaq) form.reset(editingFaq);
    else form.reset({ question: "", answer: "" });
  }, [editingFaq, form]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add New FAQ</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Question"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedName = formatName(value, {
                        allowNonConsecutiveSpaces: true,
                        allowSpecialCharacters: true,
                        allowUppercaseInBetween: true,
                        allowNumbers: true,
                        makeLettersAfterSpaceCapital: false,
                      });
                      field.onChange(formattedName);
                      form.setValue("question", formattedName);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Answer"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedName = formatName(value, {
                        allowNonConsecutiveSpaces: true,
                        allowSpecialCharacters: true,
                        allowUppercaseInBetween: true,
                        allowNumbers: true,
                        makeLettersAfterSpaceCapital: false,
                      });
                      field.onChange(formattedName);
                      form.setValue("answer", formattedName);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader /> : "Add FAQ"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
};

export default FaqModal;

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axios";

interface ChangeEmailFormProps {
  refreshData: () => void;
  oldEmail: string;
}

export function ChangeEmailForm({
  refreshData,
  oldEmail,
}: ChangeEmailFormProps) {
  const formSchema = z
    .object({
      newEmail: z.string().email("Please enter a valid email address"),
      confirmNewEmail: z.string().email("Please enter a valid email address"),
    })
    .refine((data) => data.newEmail === data.confirmNewEmail, {
      message: "Emails don't match",
      path: ["confirmNewEmail"],
    })
    .refine((data) => data.newEmail !== oldEmail, {
      message: "New email must be different from current email",
      path: ["newEmail"],
    });

  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newEmail: "",
      confirmNewEmail: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setApiError(null);
    setIsLoading(true);

    try {
      const { data } = await axiosInstance.patch(
        "/admin/cases/case-account/change-email",
        {
          newEmail: values.newEmail,
          oldEmail: oldEmail,
        }
      );

      if (!data?.success) {
        throw new Error(data?.message);
      }

      toast.success("User's email has been updated successfully");
      setIsOpen(false);
      refreshData();
      form.reset();
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError(error?.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
          setApiError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"outline"} className="mt-2">
          Change Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:w-[30vw]">
        <DialogHeader>
          <DialogTitle>Change User&apos;s Email</DialogTitle>
          <DialogDescription>
            Enter new email address and confirm it. After the change, the user
            will need to login from the new email.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {apiError && (
              <div className="text-sm font-medium text-destructive">
                {apiError}
              </div>
            )}

            <FormField
              control={form.control}
              name="newEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Email</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={50}
                      placeholder="new@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmNewEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Email</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={50}
                      placeholder="new@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  form.reset();
                  setApiError(null);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

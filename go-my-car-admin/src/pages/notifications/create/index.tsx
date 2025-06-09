"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import Toast from "@/components/toast/commonToast";
import { useNavigate } from "react-router-dom";
import { useCreateNotification } from "@/hooks/api/notification";

const createNewsSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title cannot be empty")
    .max(100, "Title must be 100 characters or less")
    .trim(),
  description: z
    .string({ required_error: "Description is required" })
    .min(1, "Description must be at least 1 characters")
    .max(1000, "Description must be 1000 characters or less")
    .trim(),
});

type FormValues = z.infer<typeof createNewsSchema>;

const CreateNotification = () => {
  const router = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(createNewsSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const onSuccessHandler = (data: any) => {
    Toast("success", data?.message || "notifications created successfully");
    router("/notifications");
  };

  const { mutate, isPending } = useCreateNotification(onSuccessHandler);

  const handleFinish = async (data: FormValues) => {
    console.log("DATA:>>", data);

    const payload = {
      topic: "general_user_notificatione",
      title: data.title,
      body: data.description,
    };

    mutate(payload);
  };

  return (
    <div className="container max-w-5xl p-6">
      <h1 className="text-2xl font-bold mb-6">Create Notification</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFinish)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Notification Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter Notification Description"
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router("/notifications")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Sending..." : "Send Notification"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
export default CreateNotification;
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import ImageUpload from "@/components/ImageUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean } & { error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

export default function AuthForm<T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const router = useRouter();

  // 2. Define a submit handler.
  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);
    if (result.success) {
      toast("Success", {
        description:
          type === "SIGN_IN"
            ? "You have successfully signed in"
            : "You have successfully signed up",
      });
      router.push("/");
    } else {
      toast(`Error ${type === "SIGN_IN" ? "signing in" : "signing up"}`, {
        description: result.error ?? "An error occurred",
        className: "error-toast",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {type === "SIGN_IN"
          ? "Welcome back to BookShelf "
          : "Create your libary account"}
      </h1>
      <p className="text-light-100">
        {type === "SIGN_IN"
          ? "Access the vast collection of resources and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-full"
        >
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    {field.name === "universityCard" ? (
                      <ImageUpload onFileChange={field.onChange} />
                    ) : (
                      <Input
                        required
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                        }
                        {...field}
                        className="form-input"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="form-btn">
            {type === "SIGN_IN" ? "Sign in" : "Sign up"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-base font-medium">
        {type === "SIGN_IN"
          ? "Don't have an account? "
          : "Already have an account? "}

        <Link
          href={type === "SIGN_IN" ? "/sign-up" : "/sign-in"}
          className="font-bold text-primary"
        >
          {type === "SIGN_IN" ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}

"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

import { signIn, verifyOtp } from "@/api/auth";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // Dynamic schema based on otpSent state
  const formSchema = useMemo(() => {
    const baseSchema = {
      email: z.string().email("Invalid email address"),
    };

    // Only add OTP validation when OTP is sent
    if (otpSent) {
      return z.object({
        ...baseSchema,
        otp: z
          .string()
          .min(6, "OTP must be 6 characters long")
          .max(6, "OTP must be 6 characters long"),
      });
    }

    return z.object({
      ...baseSchema,
      otp: z.string().optional(),
    });
  }, [otpSent]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(form.formState.errors);

    console.log("Submitting form...");
    try {
      if (!otpSent) {
        setLoading(true);
        const response = await signIn(values);

        toast.success(response.message);
        setOtpSent(true);
      } else {
        setLoading(true);
        const response = await verifyOtp({
          email: values.email,
          otp: values.otp ?? "",
        });
        toast.success(response.message);

        // Redirect to home page after successful OTP verification
        navigate("/");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("SignIn failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="md:w-[527px] gap-8 p-8 flex-1 justify-center items-center flex flex-col">
      <div className="w-full max-w-[400px] space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-[40px] tracking-tighter font-bold mb-2">
            Sign In
          </h1>
          <span className="text-base md:text-[18px] text-[#969696]">
            Please login to continue to your account.
          </span>
        </div>
      </div>

      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("Validation errors:", errors);
            })}
            className="space-y-4 w-[343px] md:w-[400px]"
          >
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="absolute w-[44px] p-1 text-[#9A9A9A] h-[21px] bg-white top-[-10px] left-3">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="!text-lg h-[59px] rounded-[10px]"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {otpSent && (
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="absolute w-[44px] p-1 text-[#9A9A9A] h-[21px] bg-white top-[-10px] left-3">
                      OTP
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-[59px] !text-lg rounded-[10px]"
                        placeholder="Enter OTP"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              className=" cursor-pointer text-[18px] px-2 py-4 w-full h-[54px]"
              type="submit"
              disabled={loading}
            >
              {otpSent ? "Verify OTP" : "Get OTP"}
              {loading && <Loader2 className="ml-2 size-[20px] animate-spin" />}
            </Button>
          </form>
        </Form>
      </div>
      <div className="text-[#6C6C6C] text-lg">
        <span>Need an account?? </span>
        <Link className="text-[#367AFF] underline font-semibold" to="/sign-up">
          Create one
        </Link>
      </div>
    </div>
  );
}

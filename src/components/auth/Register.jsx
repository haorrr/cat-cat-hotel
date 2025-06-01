"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRegister } from "../hooks/auth/useRegister"

// 1. Định nghĩa schema
export const registerSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().min(1, "Email is required").email("Email is invalid"),
    password: z.string().min(1, "Password is required"),
    full_name: z.string().min(1, "Full name is required"),
    phone: z.string().optional(),
    address: z.string().optional(),
});

export function Register() {
    const { registerMutation, isError, error, isPending } = useRegister();

    // 2. Khởi tạo form với resolver và defaultValues
    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            full_name: "",
            phone: "",
            address: "",
        },
    })

    // 3. Xử lý submit
    const onSubmit = (data) => {
        console.log(data)
        registerMutation(data)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-pink-500 cursor-pointer border-pink-500">
                    Register
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Register</DialogTitle>
                    <DialogDescription>Enter your credentials to create an account.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your full name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="min-h-[1.25rem] text-sm text-red-600">
                            {isError ? error?.message : ""}
                        </div>

                        <DialogFooter className="pt-0">
                            <Button type="submit" disabled={isPending} className="w-full">
                                {isPending ? "Signing up..." : "Sign up"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

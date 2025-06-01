"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useCreateCat } from "../hooks/cat/useCreateCat";

// 1. Định nghĩa schema
export const createCatSchema = z.object({
    name: z.string().min(1, "Name is required"),
    breed: z.string().optional(),
    age: z.number().min(0, "Age must be non-negative").optional(),
    weight: z.number().min(0, "Weight must be non-negative").optional(),
    gender: z.enum(["male", "female"], { errorMap: () => ({ message: "Gender is required" }) }),
    color: z.string().optional(),
    medical_notes: z.string().optional(),
    special_requirements: z.string().optional(),
    vaccination_status: z.string().optional(),
});

export function CreateCat() {
    const { createCatMutation, isLoading, isError, error, isSuccess, newCat } = useCreateCat();

    // 2. Khởi tạo form với resolver và defaultValues
    const form = useForm({
        resolver: zodResolver(createCatSchema),
        defaultValues: {
            name: "",
            breed: "",
            age: undefined,
            weight: undefined,
            gender: "",
            color: "",
            medical_notes: "",
            special_requirements: "",
            vaccination_status: "",
        },
    });

    // 3. Xử lý submit
    const onSubmit = (data) => {
        const payload = {
            name: data.name,
            breed: data.breed || undefined,
            age: data.age,
            weight: data.weight,
            gender: data.gender,
            color: data.color || undefined,
            medical_notes: data.medical_notes || undefined,
            special_requirements: data.special_requirements || undefined,
            vaccination_status: data.vaccination_status || undefined,
        };
        createCatMutation(payload);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-purple-500 cursor-pointer border-purple-500">
                    Add New Cat
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] w-full">
                <DialogHeader>
                    <DialogTitle>Add Cat</DialogTitle>
                    <DialogDescription>Fill in cat details below.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-3 gap-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Cat name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="breed"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Breed (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Breed" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Age (optional)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Age" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Weight (optional)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Weight" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue=""
                                        >
                                            <SelectTrigger className="">
                                                <SelectValue placeholder="Gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Color" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="vaccination_status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Vaccination Status (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Vaccination status" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="medical_notes"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Medical Notes (optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Medical notes" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="special_requirements"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Special Requirements (optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Special requirements" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="col-span-2 min-h-[1.25rem] text-sm text-red-600">
                            {isError ? error?.message : ""}
                        </div>

                        <div className="col-span-2 min-h-[1.25rem] text-sm text-green-600">
                            {isSuccess && newCat ? `Cat ${newCat.name} added with ID ${newCat.id}` : ""}
                        </div>

                        <DialogFooter className="col-span-2 pt-0">
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? "Adding..." : "Add Cat"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

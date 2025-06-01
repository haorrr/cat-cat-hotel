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
import { useBooking } from "../hooks/booking/useBooking";

// 1. Định nghĩa schema
export const bookingSchema = z.object({
  cat_id: z.string().min(1, "Cat ID is required"),
  room_id: z.string().min(1, "Room ID is required"),
  check_in_date: z.string().min(1, "Check-in date is required"),
  check_out_date: z.string().min(1, "Check-out date is required"),
  special_requests: z.string().optional(),
});

export function CreateBooking() {
  const { bookingMutation, isLoading, isError, error, isSuccess, newBooking } = useBooking();

  // 2. Khởi tạo form với resolver và defaultValues
  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      cat_id: "",
      room_id: "",
      check_in_date: "",
      check_out_date: "",
      special_requests: "",
    },
  });

  // 3. Xử lý submit
  const onSubmit = (data) => {
    // Chuyển cat_id và room_id sang số
    const payload = {
      cat_id: Number(data.cat_id),
      room_id: Number(data.room_id),
      check_in_date: data.check_in_date,
      check_out_date: data.check_out_date,
      special_requests: data.special_requests || undefined,
    };
    bookingMutation(payload);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-green-500 cursor-pointer border-green-500">
          Create Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Booking</DialogTitle>
          <DialogDescription>Fill in booking details below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="cat_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cat ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Cat ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="room_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Room ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="check_in_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-In Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="check_out_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-Out Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="special_requests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any special requests" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="min-h-[1.25rem] text-sm text-red-600">
              {isError ? error?.message : ""}
            </div>

            <div className="min-h-[1.25rem] text-sm text-green-600">  
              {isSuccess && newBooking ? `Booking ID ${newBooking.id} created!` : ""}
            </div>

            <DialogFooter className="pt-0">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Creating..." : "Create Booking"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

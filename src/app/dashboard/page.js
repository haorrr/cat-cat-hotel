// src/app/dashboard/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Cat,
  Calendar,
  CreditCard,
  Star,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  TrendingUp,
  MapPin
} from "lucide-react";
import { useGetUser } from "../../components/hooks/auth/useGetUser";
import { useGetCats } from "../../components/hooks/cat/useGetCats";
import { useGetBooking } from "../../components/hooks/booking/useGetBooking";
import { MainLayout } from "../../components/layout/MainLayout";

export default function UserDashboard() {
  const { user } = useGetUser();
  const { cats } = useGetCats({ active_only: true, limit: 4 });
  const { bookings } = useGetBooking({ limit: 5 });

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      checked_in: "bg-green-100 text-green-800",
      checked_out: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "checked_in":
        return <Heart className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const stats = [
    {
      name: "My Cats",
      value: cats?.length || 0,
      icon: Cat,
      color: "from-orange-400 to-pink-400",
      href: "/dashboard/cats"
    },
    {
      name: "Active Bookings",
      value: bookings?.filter(b => ['confirmed', 'checked_in'].includes(b.status)).length || 0,
      icon: Calendar,
      color: "from-blue-400 to-purple-400",
      href: "/dashboard/bookings"
    },
    {
      name: "Total Bookings",
      value: bookings?.length || 0,
      icon: CreditCard,
      color: "from-green-400 to-teal-400",
      href: "/dashboard/bookings"
    },
    {
      name: "Reviews Given",
      value: "12", // This would come from reviews API
      icon: Star,
      color: "from-yellow-400 to-orange-400",
      href: "/dashboard/reviews"
    }
  ];

  const upcomingBookings = bookings?.filter(booking => 
    ['confirmed', 'pending'].includes(booking.status) && 
    new Date(booking.check_in_date) >= new Date()
  ) || [];

  return (
    <MainLayout>
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.full_name || user?.username}! 🐱
                </h1>
                <p className="text-orange-100 text-lg">
                  Ready to take care of your furry friends?
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <Cat className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  href="/dashboard/bookings/new"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl hover:from-orange-100 hover:to-pink-100 transition-colors duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-2 rounded-lg mr-3">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">Book a Stay</span>
                  </div>
                  <Plus className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </Link>

                <Link
                  href="/dashboard/cats/new"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-colors duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-2 rounded-lg mr-3">
                      <Cat className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">Add New Cat</span>
                  </div>
                  <Plus className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </Link>

                <Link
                  href="/dashboard/rooms"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl hover:from-green-100 hover:to-teal-100 transition-colors duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-green-400 to-teal-400 p-2 rounded-lg mr-3">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">Browse Rooms</span>
                  </div>
                  <TrendingUp className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </Link>
              </div>
            </div>

            {/* My Cats Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Cats</h2>
                <Link
                  href="/dashboard/cats"
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              
              {cats && cats.length > 0 ? (
                <div className="space-y-4">
                  {cats.slice(0, 3).map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-orange-400 to-pink-400 h-10 w-10 rounded-full flex items-center justify-center">
                        <Cat className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {cat.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {cat.breed || "Mixed breed"} • {cat.age ? `${cat.age} years` : "Age unknown"}
                        </p>
                      </div>
                    </div>
                  ))}
                  {cats.length > 3 && (
                    <div className="text-center pt-4">
                      <span className="text-sm text-gray-500">
                        +{cats.length - 3} more cats
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Cat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No cats added yet</p>
                  <Link
                    href="/dashboard/cats/new"
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
                  >
                    Add Your First Cat
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Bookings & Upcoming */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                <Link
                  href="/dashboard/bookings"
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            Booking #{booking.id}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${booking.total_price}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">
                            <span className="font-medium">Cat:</span> {booking.cat_name}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Room:</span> {booking.room_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            <span className="font-medium">Check-in:</span> {new Date(booking.check_in_date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Check-out:</span> {new Date(booking.check_out_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-500 mb-6">
                    Start by booking your first cat stay with us!
                  </p>
                  <Link
                    href="/dashboard/bookings/new"
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 inline-flex items-center"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Book Now
                  </Link>
                </div>
              )}
            </div>

            {/* Upcoming Bookings Alert */}
            {upcomingBookings.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mt-6">
                <div className="flex items-center">
                  <div className="bg-blue-500 p-2 rounded-lg mr-4">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">
                      You have {upcomingBookings.length} upcoming booking{upcomingBookings.length > 1 ? 's' : ''}
                    </h3>
                    <p className="text-sm text-blue-700">
                      Next check-in: {new Date(upcomingBookings[0].check_in_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
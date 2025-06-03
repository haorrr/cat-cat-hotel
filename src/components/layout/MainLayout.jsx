// src/components/layout/MainLayout.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Cat,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Heart,
  Calendar,
  Home,
  Building,
  Utensils,
  Wrench,
  Star,
  CreditCard,
  Newspaper
} from "lucide-react";
import { useGetUser } from "../hooks/auth/useGetUser";
import { useLogout } from "../hooks/auth/useLogout";

export function MainLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useGetUser();
  const { logoutMutation } = useLogout();

  // Fix hydration: Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle redirect in useEffect to avoid hydration mismatch
  useEffect(() => {
    if (!isLoading && !user && mounted) {
      router.push("/auth");
    }
  }, [user, isLoading, mounted, router]);

  const navigation = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Rooms", href: "/dashboard/rooms", icon: Building },
    { name: "My Cats", href: "/dashboard/cats", icon: Cat },
    { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
    { name: "Foods", href: "/dashboard/foods", icon: Utensils },
    { name: "Services", href: "/dashboard/services", icon: Wrench },
    { name: "Reviews", href: "/dashboard/reviews", icon: Star },
    { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
    { name: "News", href: "/dashboard/news", icon: Newspaper },
  ];

  const adminNavigation = [
    { name: "Admin Dashboard", href: "/admin", icon: Settings },
    { name: "Manage Users", href: "/admin/users", icon: User },
    { name: "Manage Rooms", href: "/admin/rooms", icon: Building },
    { name: "Manage Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Manage Foods", href: "/admin/foods", icon: Utensils },
    { name: "Manage Services", href: "/admin/services", icon: Wrench },
    { name: "Manage Reviews", href: "/admin/reviews", icon: Star },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Manage News", href: "/admin/news", icon: Newspaper },
  ];

  const currentNavigation = user?.role === "admin" ? adminNavigation : navigation;

  const handleLogout = () => {
    logoutMutation();
    setIsUserMenuOpen(false);
  };

  // Prevent hydration mismatch: Always render loading state initially
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (redirect will happen in useEffect)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
            <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-2 rounded-lg">
              <Cat className="h-6 w-6 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">Cat Hotel</span>
          </div>

          {/* Navigation */}
          <nav className="mt-5 flex-1 flex flex-col divide-y divide-gray-200 overflow-y-auto">
            <div className="px-2 space-y-1">
              {currentNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? "bg-orange-50 text-orange-700 border-r-2 border-orange-500"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive ? "text-orange-500" : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User section */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-orange-400 to-pink-400 h-10 w-10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user.full_name?.charAt(0) || user.username?.charAt(0) || "U"}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.full_name || user.username}</p>
                <p className="text-xs font-medium text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 flex items-center">
              <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-1.5 rounded-lg">
                <Cat className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-bold text-gray-900">Cat Hotel</span>
            </div>
          </div>
          
          {/* User menu button */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="bg-gradient-to-r from-orange-400 to-pink-400 h-8 w-8 rounded-full flex items-center justify-center"
            >
              <span className="text-sm font-medium text-white">
                {user.full_name?.charAt(0) || user.username?.charAt(0) || "U"}
              </span>
            </button>

            {/* User dropdown */}
            {isUserMenuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-900 border-b">
                    <div className="font-medium">{user.full_name || user.username}</div>
                    <div className="text-gray-500">{user.email}</div>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="mr-3 h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 flex z-40 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-2 rounded-lg">
                    <Cat className="h-6 w-6 text-white" />
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">Cat Hotel</span>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {currentNavigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                          isActive
                            ? "bg-orange-50 text-orange-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <item.icon
                          className={`mr-4 flex-shrink-0 h-6 w-6 ${
                            isActive ? "text-orange-500" : "text-gray-400 group-hover:text-gray-500"
                          }`}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
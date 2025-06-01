// src/app/dashboard/bookings/new/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  Cat,
  Building,
  DollarSign,
  Clock,
  Plus,
  Minus,
  Info,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { useCreateBooking } from "../../../../components/hooks/booking/useCreateBooking";
import { useGetCats } from "../../../../components/hooks/cat/useGetCats";
import { useGetRoomsList } from "../../../../components/hooks/room/useGetRoomsList";
import { useGetServicesList } from "../../../../components/hooks/service/useGetServicesList";
import { useGetFoods } from "../../../../components/hooks/food/useGetFoods";
import { MainLayout } from "../../../../components/layout/MainLayout";

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    cat_id: searchParams.get("cat_id") || "",
    room_id: searchParams.get("room_id") || "",
    check_in_date: "",
    check_out_date: "",
    services: [],
    foods: [],
    special_requests: ""
  });
  const [errors, setErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const { createBookingMutation, isLoading, isError, error } = useCreateBooking();
  const { cats } = useGetCats({ active_only: true });
  const { data: roomsData } = useGetRoomsList({ available_only: true });
  const { data: servicesData } = useGetServicesList({ active_only: true });
  const { foods } = useGetFoods({ active_only: true });

  const rooms = roomsData?.rooms || [];
  const services = servicesData?.services || [];

  const steps = [
    { id: 1, name: "Cat & Room", icon: Cat },
    { id: 2, name: "Dates", icon: Calendar },
    { id: 3, name: "Services & Food", icon: Plus },
    { id: 4, name: "Review & Book", icon: CheckCircle }
  ];

  // Calculate total price
  useEffect(() => {
    let total = 0;
    
    // Room price calculation
    if (bookingData.room_id && bookingData.check_in_date && bookingData.check_out_date) {
      const selectedRoom = rooms.find(r => r.id === parseInt(bookingData.room_id));
      if (selectedRoom) {
        const checkIn = new Date(bookingData.check_in_date);
        const checkOut = new Date(bookingData.check_out_date);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        total += selectedRoom.price_per_day * nights;
      }
    }

    // Services price
    bookingData.services.forEach(service => {
      const serviceData = services.find(s => s.id === service.service_id);
      if (serviceData) {
        total += serviceData.price * (service.quantity || 1);
      }
    });

    // Food price
    bookingData.foods.forEach(food => {
      const foodData = foods?.find(f => f.id === food.food_id);
      if (foodData) {
        total += foodData.price_per_serving * (food.quantity || 1);
      }
    });

    setTotalPrice(total);
  }, [bookingData, rooms, services, foods]);

  const handleChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const addService = (serviceId) => {
    const existingService = bookingData.services.find(s => s.service_id === serviceId);
    if (existingService) {
      setBookingData(prev => ({
        ...prev,
        services: prev.services.map(s =>
          s.service_id === serviceId
            ? { ...s, quantity: (s.quantity || 1) + 1 }
            : s
        )
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        services: [...prev.services, {
          service_id: serviceId,
          quantity: 1,
          service_date: bookingData.check_in_date,
          notes: ""
        }]
      }));
    }
  };

  const removeService = (serviceId) => {
    const existingService = bookingData.services.find(s => s.service_id === serviceId);
    if (existingService && existingService.quantity > 1) {
      setBookingData(prev => ({
        ...prev,
        services: prev.services.map(s =>
          s.service_id === serviceId
            ? { ...s, quantity: s.quantity - 1 }
            : s
        )
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        services: prev.services.filter(s => s.service_id !== serviceId)
      }));
    }
  };

  const addFood = (foodId) => {
    const existingFood = bookingData.foods.find(f => f.food_id === foodId);
    if (existingFood) {
      setBookingData(prev => ({
        ...prev,
        foods: prev.foods.map(f =>
          f.food_id === foodId
            ? { ...f, quantity: (f.quantity || 1) + 1 }
            : f
        )
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        foods: [...prev.foods, {
          food_id: foodId,
          quantity: 1,
          feeding_date: bookingData.check_in_date,
          meal_time: "morning",
          notes: ""
        }]
      }));
    }
  };

  const removeFood = (foodId) => {
    const existingFood = bookingData.foods.find(f => f.food_id === foodId);
    if (existingFood && existingFood.quantity > 1) {
      setBookingData(prev => ({
        ...prev,
        foods: prev.foods.map(f =>
          f.food_id === foodId
            ? { ...f, quantity: f.quantity - 1 }
            : f
        )
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        foods: prev.foods.filter(f => f.food_id !== foodId)
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!bookingData.cat_id) newErrors.cat_id = "Please select a cat";
        if (!bookingData.room_id) newErrors.room_id = "Please select a room";
        break;
      case 2:
        if (!bookingData.check_in_date) newErrors.check_in_date = "Check-in date is required";
        if (!bookingData.check_out_date) newErrors.check_out_date = "Check-out date is required";
        if (bookingData.check_in_date && bookingData.check_out_date) {
          const checkIn = new Date(bookingData.check_in_date);
          const checkOut = new Date(bookingData.check_out_date);
          if (checkOut <= checkIn) {
            newErrors.check_out_date = "Check-out must be after check-in";
          }
          if (checkIn < new Date().setHours(0, 0, 0, 0)) {
            newErrors.check_in_date = "Check-in date cannot be in the past";
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      const submitData = {
        ...bookingData,
        cat_id: parseInt(bookingData.cat_id),
        room_id: parseInt(bookingData.room_id)
      };

      createBookingMutation(submitData, {
        onSuccess: () => {
          router.push("/dashboard/bookings");
        }
      });
    }
  };

  const selectedCat = cats?.find(c => c.id === parseInt(bookingData.cat_id));
  const selectedRoom = rooms.find(r => r.id === parseInt(bookingData.room_id));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateNights = () => {
    if (bookingData.check_in_date && bookingData.check_out_date) {
      const checkIn = new Date(bookingData.check_in_date);
      const checkOut = new Date(bookingData.check_out_date);
      return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Booking</h1>
            <p className="text-gray-600 mt-1">
              Book a comfortable stay for your cat
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200 ${
                  currentStep >= step.id
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "border-gray-300 text-gray-400"
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? "text-orange-600" : "text-gray-500"
                  }`}>
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-12 h-1 mx-4 rounded ${
                    currentStep > step.id ? "bg-orange-500" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {isError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{error?.message || "Failed to create booking"}</p>
              </div>
            </div>
          )}

          {/* Step 1: Cat & Room Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Cat & Room</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Cat Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Choose Your Cat *
                  </label>
                  {cats && cats.length > 0 ? (
                    <div className="space-y-3">
                      {cats.map((cat) => (
                        <label
                          key={cat.id}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                            bookingData.cat_id === cat.id.toString()
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="cat_id"
                            value={cat.id}
                            checked={bookingData.cat_id === cat.id.toString()}
                            onChange={(e) => handleChange("cat_id", e.target.value)}
                            className="sr-only"
                          />
                          <div className="bg-gradient-to-r from-orange-400 to-pink-400 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                            <Cat className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{cat.name}</p>
                            <p className="text-sm text-gray-600">
                              {cat.breed || "Mixed breed"} • {cat.gender} • {cat.age || "Unknown"} years
                            </p>
                          </div>
                          {bookingData.cat_id === cat.id.toString() && (
                            <CheckCircle className="h-5 w-5 text-orange-500" />
                          )}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-gray-200 rounded-lg">
                      <Cat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No cats found</p>
                      <button
                        onClick={() => router.push("/dashboard/cats/new")}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                      >
                        Add a Cat First
                      </button>
                    </div>
                  )}
                  {errors.cat_id && (
                    <p className="mt-2 text-sm text-red-600">{errors.cat_id}</p>
                  )}
                </div>

                {/* Room Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Choose a Room *
                  </label>
                  {rooms.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {rooms.map((room) => (
                        <label
                          key={room.id}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                            bookingData.room_id === room.id.toString()
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="room_id"
                            value={room.id}
                            checked={bookingData.room_id === room.id.toString()}
                            onChange={(e) => handleChange("room_id", e.target.value)}
                            className="sr-only"
                          />
                          <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-12 w-12 rounded-lg flex items-center justify-center mr-4">
                            <Building className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-gray-900">{room.name}</p>
                              <p className="font-semibold text-gray-900">${room.price_per_day}/night</p>
                            </div>
                            <p className="text-sm text-gray-600 capitalize">
                              {room.room_type} • Up to {room.capacity} cats
                            </p>
                          </div>
                          {bookingData.room_id === room.id.toString() && (
                            <CheckCircle className="h-5 w-5 text-orange-500 ml-2" />
                          )}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-gray-200 rounded-lg">
                      <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No available rooms</p>
                    </div>
                  )}
                  {errors.room_id && (
                    <p className="mt-2 text-sm text-red-600">{errors.room_id}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date Selection */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Dates</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    value={bookingData.check_in_date}
                    onChange={(e) => handleChange("check_in_date", e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.check_in_date ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.check_in_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.check_in_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    value={bookingData.check_out_date}
                    onChange={(e) => handleChange("check_out_date", e.target.value)}
                    min={bookingData.check_in_date || new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.check_out_date ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.check_out_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.check_out_date}</p>
                  )}
                </div>
              </div>

              {bookingData.check_in_date && bookingData.check_out_date && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <Info className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <p className="text-blue-900 font-medium">
                        Stay Duration: {calculateNights()} nights
                      </p>
                      <p className="text-blue-700 text-sm">
                        From {new Date(bookingData.check_in_date).toLocaleDateString()} to {new Date(bookingData.check_out_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Services & Food */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add Services & Food</h2>
              
              <div className="space-y-8">
                {/* Services */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Services</h3>
                  {services.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {services.map((service) => {
                        const selectedService = bookingData.services.find(s => s.service_id === service.id);
                        const quantity = selectedService?.quantity || 0;
                        
                        return (
                          <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{service.name}</h4>
                              <span className="font-semibold text-gray-900">${service.price}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 capitalize">{service.category}</span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => removeService(service.id)}
                                  disabled={quantity === 0}
                                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center font-medium">{quantity}</span>
                                <button
                                  onClick={() => addService(service.id)}
                                  className="p-1 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors duration-200"
                                >
                                  <Plus className="h-4 w-4 text-orange-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">No services available</p>
                  )}
                </div>

                {/* Food */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Options</h3>
                  {foods && foods.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {foods.map((food) => {
                        const selectedFood = bookingData.foods.find(f => f.food_id === food.id);
                        const quantity = selectedFood?.quantity || 0;
                        
                        return (
                          <div key={food.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{food.name}</h4>
                              <span className="font-semibold text-gray-900">${food.price_per_serving}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{food.brand}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 capitalize">{food.category}</span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => removeFood(food.id)}
                                  disabled={quantity === 0}
                                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center font-medium">{quantity}</span>
                                <button
                                  onClick={() => addFood(food.id)}
                                  className="p-1 rounded-full bg-green-100 hover:bg-green-200 transition-colors duration-200"
                                >
                                  <Plus className="h-4 w-4 text-green-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">No food options available</p>
                  )}
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={bookingData.special_requests}
                    onChange={(e) => handleChange("special_requests", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Any special requests or notes for your cat's stay..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Book */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Review & Confirm</h2>
              
              <div className="space-y-6">
                {/* Booking Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cat:</span>
                      <span className="font-medium text-gray-900">{selectedCat?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room:</span>
                      <span className="font-medium text-gray-900">{selectedRoom?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(bookingData.check_in_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(bookingData.check_out_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-900">{calculateNights()} nights</span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Room ({calculateNights()} nights × ${selectedRoom?.price_per_day})
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency((selectedRoom?.price_per_day || 0) * calculateNights())}
                      </span>
                    </div>
                    
                    {bookingData.services.length > 0 && (
                      <div>
                        <div className="text-gray-600 mb-2">Services:</div>
                        {bookingData.services.map((service) => {
                          const serviceData = services.find(s => s.id === service.service_id);
                          return (
                            <div key={service.service_id} className="flex justify-between ml-4">
                              <span className="text-gray-600">
                                {serviceData?.name} × {service.quantity}
                              </span>
                              <span className="font-medium text-gray-900">
                                {formatCurrency((serviceData?.price || 0) * service.quantity)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {bookingData.foods.length > 0 && (
                      <div>
                        <div className="text-gray-600 mb-2">Food:</div>
                        {bookingData.foods.map((food) => {
                          const foodData = foods?.find(f => f.id === food.food_id);
                          return (
                            <div key={food.food_id} className="flex justify-between ml-4">
                              <span className="text-gray-600">
                                {foodData?.name} × {food.quantity}
                              </span>
                              <span className="font-medium text-gray-900">
                                {formatCurrency((foodData?.price_per_serving || 0) * food.quantity)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-semibold">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-gray-900">{formatCurrency(totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {bookingData.special_requests && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Special Requests:</h4>
                    <p className="text-blue-700">{bookingData.special_requests}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </button>

            <div className="flex space-x-4">
              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
                >
                  Next
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Floating Price Summary */}
        {totalPrice > 0 && (
          <div className="fixed bottom-6 right-6 bg-white shadow-lg border border-gray-200 rounded-xl p-4 z-10">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Total Price</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPrice)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
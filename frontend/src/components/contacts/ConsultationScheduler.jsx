"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaTimes, FaUser } from "react-icons/fa";
import { toast } from "sonner";

const ConsultationScheduler = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadAvailableTimes();
    }
  }, [isOpen]);

  const loadAvailableTimes = () => {
    const savedTimes = JSON.parse(
      localStorage.getItem("scheduleSlots") || "[]"
    );
    const activeTimes = savedTimes.filter((slot) => slot.status === "active");
    setAvailableTimes(activeTimes);
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        // Skip weekends
        dates.push(date.toISOString().split("T")[0]);
      }
    }
    return dates;
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error on input change
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    loadAvailableTimes();
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  // Simple validation for required fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else {
      // Simple email regex check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email))
        newErrors.email = "Invalid email address";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      const consultations = JSON.parse(
        localStorage.getItem("consultations") || "[]"
      );
      const newConsultation = {
        id: Date.now(),
        ...formData,
        date: selectedDate,
        time: selectedTime,
        timestamp: new Date().toISOString(),
        status: "pending",
      };
      consultations.push(newConsultation);
      localStorage.setItem("consultations", JSON.stringify(consultations));

      toast.success(
        "Consultation scheduled successfully! We'll confirm your appointment soon."
      );

      // Reset form and steps
      setStep(1);
      setSelectedDate("");
      setSelectedTime("");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setErrors({});
      onClose();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto mb-20"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Schedule Consultation
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              <FaCalendarAlt size={14} />
            </div>
            <div
              className={`w-8 h-1 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}
            />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              <FaClock size={14} />
            </div>
            <div
              className={`w-8 h-1 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`}
            />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              <FaUser size={14} />
            </div>
          </div>
        </div>

        {/* Step 1: Select Date */}
        {step === 1 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Select Date
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {getAvailableDates().map((date) => (
                <motion.button
                  key={date}
                  onClick={() => handleDateSelect(date)}
                  className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-500 transition-all duration-200 text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Time */}
        {step === 2 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Select Time
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {formatDate(selectedDate)}
            </p>
            {availableTimes.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {availableTimes.map((slot) => (
                  <motion.button
                    key={slot.id}
                    onClick={() => handleTimeSelect(slot.time)}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-500 transition-all duration-200 text-center font-medium text-gray-900 dark:text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                  >
                    {slot.time}
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1">
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No available time slots. Please contact us directly.
                </p>
              </div>
            )}
            <button
              onClick={() => setStep(1)}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
              type="button"
            >
              ← Back to date selection
            </button>
          </div>
        )}
        {step === 3 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Your Details
            </h3>
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <div className="font-medium">{formatDate(selectedDate)}</div>
                <div>{selectedTime}</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full rounded-xl border px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  placeholder="Your full name"
                  autoComplete="name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full rounded-xl border px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="your.email@example.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone (optional) */}
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1234567890"
                  autoComplete="tel"
                />
              </div>

              {/* Message (optional) */}
              <div>
                <label
                  htmlFor="message"
                  className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Additional information (optional)"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule Consultation
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ConsultationScheduler;

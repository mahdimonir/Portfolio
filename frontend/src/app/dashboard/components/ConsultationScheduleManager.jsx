"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaCheck,
  FaClock,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaPlus,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { toast } from "sonner";

const ConsultationScheduleManager = () => {
  const [activeTab, setActiveTab] = useState("consultations");
  const [consultations, setConsultations] = useState([]);
  const [scheduleSlots, setScheduleSlots] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    time: "",
    status: "active",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedConsultations = JSON.parse(
      localStorage.getItem("consultations") || "[]"
    );
    const savedSlots = JSON.parse(
      localStorage.getItem("scheduleSlots") || "[]"
    );

    setConsultations(
      savedConsultations.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      )
    );
    setScheduleSlots(savedSlots.sort((a, b) => a.time.localeCompare(b.time)));
  };

  const updateConsultationStatus = (id, status) => {
    const updatedConsultations = consultations.map((consultation) =>
      consultation.id === id ? { ...consultation, status } : consultation
    );
    setConsultations(updatedConsultations);
    localStorage.setItem("consultations", JSON.stringify(updatedConsultations));
    toast.success(`Consultation ${status} successfully!`);
  };

  const deleteConsultation = (id) => {
    const updatedConsultations = consultations.filter(
      (consultation) => consultation.id !== id
    );
    setConsultations(updatedConsultations);
    localStorage.setItem("consultations", JSON.stringify(updatedConsultations));
    toast.success("Consultation deleted successfully!");
  };

  const handleSaveSlot = (e) => {
    e.preventDefault();

    let updatedSlots;

    if (editingSlot) {
      updatedSlots = scheduleSlots.map((slot) =>
        slot.id === editingSlot.id ? { ...formData, id: editingSlot.id } : slot
      );
      toast.success("Schedule slot updated successfully!");
    } else {
      const newSlot = {
        ...formData,
        id: Date.now(),
      };
      updatedSlots = [...scheduleSlots, newSlot];
      toast.success("Schedule slot added successfully!");
    }

    setScheduleSlots(updatedSlots);
    localStorage.setItem("scheduleSlots", JSON.stringify(updatedSlots));
    setIsFormOpen(false);
    setEditingSlot(null);
    setFormData({ time: "", status: "active" });
  };

  const handleEditSlot = (slot) => {
    setEditingSlot(slot);
    setFormData({
      time: slot.time,
      status: slot.status,
    });
    setIsFormOpen(true);
  };

  const handleDeleteSlot = (id) => {
    if (window.confirm("Are you sure you want to delete this time slot?")) {
      const updatedSlots = scheduleSlots.filter((slot) => slot.id !== id);
      setScheduleSlots(updatedSlots);
      localStorage.setItem("scheduleSlots", JSON.stringify(updatedSlots));
      toast.success("Schedule slot deleted successfully!");
    }
  };

  const toggleSlotStatus = (id) => {
    const updatedSlots = scheduleSlots.map((slot) =>
      slot.id === id
        ? { ...slot, status: slot.status === "active" ? "inactive" : "active" }
        : slot
    );
    setScheduleSlots(updatedSlots);
    localStorage.setItem("scheduleSlots", JSON.stringify(updatedSlots));
    toast.success("Schedule slot status updated!");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const tabs = [
    {
      id: "consultations",
      label: "Consultations",
      count: consultations.length,
    },
    { id: "schedule", label: "Schedule Times", count: scheduleSlots.length },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Consultation & Schedule Manager
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage consultations and available time slots
          </p>
        </div>
        {activeTab === "schedule" && (
          <motion.button
            onClick={() => {
              setEditingSlot(null);
              setFormData({ time: "", status: "active" });
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaPlus size={16} />
            Add Time Slot
          </motion.button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "consultations" ? (
          consultations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Consultations Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No consultations available.
              </p>
            </div>
          ) : (
            consultations.map((consultation) => (
              <motion.div
                key={consultation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <FaCalendarAlt
                          className="text-blue-600 dark:text-blue-400"
                          size={20}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {consultation.name}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              consultation.status
                            )}`}
                          >
                            {consultation.status.charAt(0).toUpperCase() +
                              consultation.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt size={12} />
                            {formatDate(consultation.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaClock size={12} />
                            {consultation.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <FaEnvelope size={12} />
                            {consultation.email}
                          </span>
                          {consultation.phone && (
                            <span className="flex items-center gap-1">
                              <FaPhone size={12} />
                              {consultation.phone}
                            </span>
                          )}
                        </div>
                        {consultation.message && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {consultation.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {consultation.status === "pending" && (
                      <>
                        <motion.button
                          onClick={() =>
                            updateConsultationStatus(
                              consultation.id,
                              "confirmed"
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FaCheck size={14} />
                          <span className="hidden sm:inline">Confirm</span>
                        </motion.button>
                        <motion.button
                          onClick={() =>
                            updateConsultationStatus(
                              consultation.id,
                              "cancelled"
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FaTimes size={14} />
                          <span className="hidden sm:inline">Cancel</span>
                        </motion.button>
                      </>
                    )}

                    {consultation.status === "confirmed" && (
                      <motion.button
                        onClick={() =>
                          updateConsultationStatus(consultation.id, "completed")
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaCheck size={14} />
                        <span className="hidden sm:inline">Complete</span>
                      </motion.button>
                    )}

                    <motion.button
                      onClick={() => deleteConsultation(consultation.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaTrash size={14} />
                      <span className="hidden sm:inline">Delete</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )
        ) : scheduleSlots.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClock className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Time Slots
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add your first available time slot for consultations.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {scheduleSlots.map((slot) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <FaClock
                        className="text-blue-600 dark:text-blue-400"
                        size={20}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {slot.time}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          slot.status
                        )}`}
                      >
                        {slot.status.charAt(0).toUpperCase() +
                          slot.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => toggleSlotStatus(slot.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        slot.status === "active"
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {slot.status === "active" ? (
                        <FaTimes size={14} />
                      ) : (
                        <FaCheck size={14} />
                      )}
                      <span className="hidden sm:inline">
                        {slot.status === "active" ? "Deactivate" : "Activate"}
                      </span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleEditSlot(slot)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaEdit size={14} />
                      <span className="hidden sm:inline">Edit</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaTrash size={14} />
                      <span className="hidden sm:inline">Delete</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingSlot ? "Edit Time Slot" : "Add Time Slot"}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  {editingSlot ? "Update" : "Add"} Time Slot
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ConsultationScheduleManager;

"use client";

import { fetchAPI } from "@/lib/fetchApi";
import { getStatusColor } from "@/lib/status";
import { motion } from "framer-motion";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
} from "react";
import {
    FaCalendarAlt,
    FaCheck,
    FaClock,
    FaEdit,
    FaPlus,
    FaTimes,
    FaTrash,
} from "react-icons/fa";
import { toast } from "sonner";

const ConsultationsManager = forwardRef(
  ({ filterQuery = "", filterStatus = "all", sortOption = "newest" }, ref) => {
    const [activeSubTab, setActiveSubTab] = useState("appointments");
    const [consultations, setConsultations] = useState([]);
    const [scheduleSlots, setScheduleSlots] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);
    const [formData, setFormData] = useState({ time: "", status: "active" });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
      fetchConsultations();
      // Load slots from localStorage for now as they are configuration
      try {
        const savedSlots = JSON.parse(
          localStorage.getItem("scheduleSlots") || "[]"
        );
      } catch (e) {
        // no-op
      }
    }, []);

    useEffect(() => {
      fetchSlots();
    }, []);

    const fetchSlots = async () => {
      try {
        const response = await fetchAPI("/slots", { cache: "no-store" });
        if (response.data) {
          setScheduleSlots(response.data);
        }
      } catch (error) {
        toast.error("Failed to fetch slots");
      }
    };

    const fetchConsultations = async () => {
      try {
        const response = await fetchAPI("/bookings", {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data) {
          setConsultations(response.data);
        }
      } catch (error) {
        toast.error("Failed to fetch consultations");
      }
    };

    useImperativeHandle(ref, () => ({
      openCreateSlot: () => {
        setActiveSubTab("schedule");
        setEditingSlot(null);
        setFormData({ time: "", status: "active" });
        setIsFormOpen(true);
      },
    }));

    const updateConsultationStatus = async (id, status) => {
      try {
        const response = await fetchAPI(`/bookings/${id}/status`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status }),
        });

        if (response.error) throw new Error(response.error);

        setConsultations(
          consultations.map((c) => (c._id === id ? { ...c, status } : c))
        );
        toast.success(`Consultation ${status} successfully!`);
      } catch (error) {
        toast.error(error.message || "Failed to update status");
      }
    };

    const deleteConsultation = async (id) => {
      if (!window.confirm("Are you sure you want to delete this consultation?")) return;
      
      try {
        const response = await fetchAPI(`/bookings/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.error) throw new Error(response.error);

        setConsultations(consultations.filter((c) => c._id !== id));
        toast.success("Consultation deleted successfully!");
      } catch (error) {
        toast.error(error.message || "Failed to delete consultation");
      }
    };

    const handleSaveSlot = async (e) => {
      e.preventDefault();
      try {
        if (editingSlot) {
          const response = await fetchAPI(`/slots/${editingSlot._id}`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(formData),
          });
          if (response.error) throw new Error(response.error);
          
          setScheduleSlots(
            scheduleSlots.map((slot) =>
              slot._id === editingSlot._id ? response.data : slot
            )
          );
          toast.success("Schedule slot updated successfully!");
        } else {
          const response = await fetchAPI("/slots", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(formData),
          });
          if (response.error) throw new Error(response.error);

          setScheduleSlots([...scheduleSlots, response.data]);
          toast.success("Schedule slot added successfully!");
        }
        setIsFormOpen(false);
        setEditingSlot(null);
        setFormData({ time: "", status: "active" });
      } catch (error) {
        toast.error(error.message || "Failed to save slot");
      }
    };

    const handleEditSlot = (slot) => {
      setEditingSlot(slot);
      setFormData({ time: slot.time, status: slot.status });
      setIsFormOpen(true);
    };

    const handleDeleteSlot = async (id) => {
      if (!window.confirm("Are you sure you want to delete this time slot?")) return;
      
      try {
        const response = await fetchAPI(`/slots/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.error) throw new Error(response.error);

        setScheduleSlots(scheduleSlots.filter((s) => s._id !== id));
        toast.success("Schedule slot deleted successfully!");
      } catch (error) {
        toast.error(error.message || "Failed to delete slot");
      }
    };

    const toggleSlotStatus = async (id, currentStatus) => {
      try {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        const response = await fetchAPI(`/slots/${id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
        if (response.error) throw new Error(response.error);

        setScheduleSlots(
          scheduleSlots.map((s) => (s._id === id ? { ...s, status: newStatus } : s))
        );
        toast.success("Schedule slot status updated!");
      } catch (error) {
        toast.error(error.message || "Failed to update status");
      }
    };

    const filteredConsultations = useMemo(() => {
      let data = [...consultations];
      const q = filterQuery.trim().toLowerCase();
      if (q) {
        data = data.filter((c) =>
          `${c.name || ""} ${c.email || ""} ${c.phone || ""} ${c.message || ""}`
            .toLowerCase()
            .includes(q)
        );
      }
      if (filterStatus !== "all") {
        data = data.filter(
          (c) => String(c.status || "").toLowerCase() === filterStatus
        );
      }
      data.sort((a, b) => {
        const aDate = new Date(a.timestamp || 0).getTime();
        const bDate = new Date(b.timestamp || 0).getTime();
        const aName = String(a.name || "").toLowerCase();
        const bName = String(b.name || "").toLowerCase();
        switch (sortOption) {
          case "oldest":
            return aDate - bDate;
          case "a-z":
            return aName.localeCompare(bName);
          case "z-a":
            return bName.localeCompare(aName);
          case "newest":
          default:
            return bDate - aDate;
        }
      });
      return data;
    }, [consultations, filterQuery, filterStatus, sortOption]);

    const filteredSlots = useMemo(() => {
      let data = [...scheduleSlots];
      const q = filterQuery.trim().toLowerCase();
      if (q) {
        data = data.filter((s) =>
          String(s.time || "")
            .toLowerCase()
            .includes(q)
        );
      }
      if (filterStatus !== "all") {
        data = data.filter(
          (s) => String(s.status || "").toLowerCase() === filterStatus
        );
      }
      data.sort((a, b) =>
        String(a.time || "").localeCompare(String(b.time || ""))
      );
      return data;
    }, [scheduleSlots, filterQuery, filterStatus]);

    const formatDate = (dateString) =>
      new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    const formatTime = (time24) => {
      if (!time24) return "";
      const [hours, minutes] = time24.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };

    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-1">
            {[
              {
                id: "appointments",
                label: "Appointments",
                count: consultations.length,
              },
              {
                id: "schedule",
                label: "Schedule Times",
                count: scheduleSlots.length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeSubTab === tab.id
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

        <div className="space-y-4">
          {activeSubTab === "appointments" ? (
            filteredConsultations.length === 0 ? (
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
              (() => {
                const start = (currentPage - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                return filteredConsultations.slice(start, end);
              })().map((consultation) => (
                <motion.div
                  key={consultation._id}
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
                              {String(consultation.status)
                                .charAt(0)
                                .toUpperCase() +
                                String(consultation.status).slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt size={12} />
                              {formatDate(consultation.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock size={12} />
                              <FaClock size={12} />
                              {formatTime(consultation.time)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              {consultation.email}
                            </span>
                            {consultation.phone && (
                              <span className="flex items-center gap-1">
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
                                consultation._id,
                                "confirmed"
                              )
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FaCheck size={14} />
                            <span className="hidden sm:inline">Confirm</span>
                          </motion.button>
                          <motion.button
                            onClick={() =>
                              updateConsultationStatus(
                                consultation._id,
                                "cancelled"
                              )
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
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
                            updateConsultationStatus(
                              consultation._id,
                              "completed"
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FaCheck size={14} />
                          <span className="hidden sm:inline">Complete</span>
                        </motion.button>
                      )}

                      <motion.button
                        onClick={() => deleteConsultation(consultation._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
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
          ) : filteredSlots.length === 0 ? (
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
              <motion.button
                onClick={() => {
                  setEditingSlot(null);
                  setFormData({ time: "", status: "active" });
                  setIsFormOpen(true);
                }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaPlus size={16} />
                Add Time Slot
              </motion.button>
            </div>
          ) : (
            <div className="grid gap-4">
              {(() => {
                const start = (currentPage - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                return filteredSlots.slice(start, end);
              })().map((slot) => (
                <motion.div
                  key={slot._id}
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
                          {formatTime(slot.time)}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            slot.status
                          )}`}
                        >
                          {String(slot.status).charAt(0).toUpperCase() +
                            String(slot.status).slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => toggleSlotStatus(slot._id, slot.status)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
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
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaEdit size={14} />
                        <span className="hidden sm:inline">Edit</span>
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteSlot(slot._id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
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

        {/* Pagination */}
        <div className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of{" "}
            {Math.max(
              1,
              Math.ceil(
                ((activeSubTab === "appointments"
                  ? filteredConsultations.length
                  : filteredSlots.length) || 0) / itemsPerPage
              )
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({
              length: Math.max(
                1,
                Math.ceil(
                  ((activeSubTab === "appointments"
                    ? filteredConsultations.length
                    : filteredSlots.length) || 0) / itemsPerPage
                )
              ),
            }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 ${
                  currentPage === idx + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : ""
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={
                currentPage >=
                Math.max(
                  1,
                  Math.ceil(
                    ((activeSubTab === "appointments"
                      ? filteredConsultations.length
                      : filteredSlots.length) || 0) / itemsPerPage
                  )
                )
              }
              className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>

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
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
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
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    {editingSlot ? "Update" : "Add"} Time Slot
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
  }
);

export default ConsultationsManager;

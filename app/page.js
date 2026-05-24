"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Home() {
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Todo",
    due_date: "",
  });

  const API_URL = "https://mini-task-dashboard-backend.onrender.com/api/tasks";

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);

      setTasks(res.data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (editId) {
        await axios.put(
          `${API_URL}/${editId}`,
          formData
        );

        toast.success("Task updated successfully");
      } else {
        await axios.post(API_URL, formData);

        toast.success("Task added successfully");
      }

      setFormData({
        title: "",
        description: "",
        status: "Todo",
        due_date: "",
      });

      setEditId(null);

      fetchTasks();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }

    setLoading(false);
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      toast.success("Task deleted successfully");

      fetchTasks();
    } catch (error) {
      toast.error("Failed to delete task");
      console.log(error);
    }
  };

  const editTask = (task) => {
    setEditId(task.id);

    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      due_date: task.due_date
        ? task.due_date.split("T")[0]
        : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-10 text-slate-800">
          Mini Task Dashboard
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-lg mb-10 space-y-4"
        >
          <input
            type="text"
            placeholder="Task Title"
            required
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Task Description"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />

          <select
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
          >
            <option>Todo</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <input
            type="date"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.due_date}
            onChange={(e) =>
              setFormData({
                ...formData,
                due_date: e.target.value,
              })
            }
          />

          <button
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : editId
              ? "Update Task"
              : "Add Task"}
          </button>
        </form>

        {tasks.length === 0 && (
          <div className="text-center text-gray-500 text-lg">
            No tasks available
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <h2 className="text-2xl font-bold text-slate-800">
                {task.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {task.description}
              </p>

              <div className="flex justify-between items-center mt-5">
                <div className="space-y-1">
                  <p>
                    <span className="font-semibold">
                      Status:
                    </span>{" "}

                    <span
                      className={
                        task.status === "Completed"
                          ? "text-green-600 font-semibold"
                          : task.status ===
                            "In Progress"
                          ? "text-yellow-600 font-semibold"
                          : "text-red-500 font-semibold"
                      }
                    >
                      {task.status}
                    </span>
                  </p>

                  <p>
                    <span className="font-semibold">
                      Due:
                    </span>{" "}
                    {task.due_date
                      ? new Date(
                          task.due_date
                        ).toLocaleDateString()
                      : "No Date"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      editTask(task)
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteTask(task.id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="text-center text-gray-500 mt-12">
          Built with Next.js, Express & Supabase
        </footer>
      </div>
    </main>
  );
}

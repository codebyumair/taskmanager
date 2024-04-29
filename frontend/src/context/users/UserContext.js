import { createContext, useState } from "react";
import { toast } from "react-toastify";
export const UserContext = createContext();

const Provider = ({ children }) => {
  const host = "http://localhost:5000";
  const tasksInitial = [];
  const userInitial = [];
  const [tasks, setTasks] = useState(tasksInitial);
  const [isAdmin, setIsAdmin] = useState(false);

  const getTasks = async () => {
    try {
      const response = await fetch(`${host}/api/tasks/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      setTasks(json.tasks);
      setIsAdmin(json.isAdmin);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const createTask = async (taskName, assignedTo, status) => {
    try {
      const response = await fetch(`${host}/api/tasks/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({ taskName, assignedTo, status }),
      });

      const task = await response.json();
      setTasks([task, ...tasks]);
      toast.success("Task created successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${host}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      });

      const json = await response.json();
      console.log(json);
      const newTasks = tasks.filter((task) => {
        return task._id !== id;
      });
      setTasks(newTasks);
      toast.success("Task deleted sucessfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const requestForApproval = async (newStatus, id) => {
    try {
      const response = await fetch(
        `${host}/api/tasks/request-status-change/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
          body: JSON.stringify({ newStatus }),
        }
      );

      const json = await response.json();
      console.log(json);
      toast.success("Request generated. Waiting for admin to approved");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const approvedStatusChange = async (id, approved, newStatus) => {
    try {
      const response = await fetch(
        `${host}/api/tasks/approve-status-change/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
          body: JSON.stringify({ approved, newStatus }),
        }
      );

      const json = await response.json();
      console.log(json);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    tasks,
    isAdmin,
    getTasks,
    createTask,
    deleteTask,
    requestForApproval,
    approvedStatusChange,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default Provider;

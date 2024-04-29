import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/users/UserContext";
import FormField from "./FormField";
import UserDropdown from "./UserDropdown";
import DropDown from "./DropDown";

const AddTask = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const { createTask, isAdmin } = context;
  const [formData, setFormData] = useState({
    taskName: "",
    assignee: "",
    status: "",
  });

  const statusList = ["COMPLETE", "IN PROGRESS", "INITIATED", "INCOMPLETE"];

  const { taskName, assignee, status } = formData;
  // const onChange = (e) => {
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [e.target.name]: e.target.value,
  //   }));
  // };

  const handleClick = (e) => {
    e.preventDefault();
    if (!taskName) {
      toast.error("Please enter task name");
    }

    if (!assignee) {
      toast.error("Please select assignee");
    }

    if (!status) {
      toast.error("Please select status");
    }

    if (taskName && assignee && status) {
      createTask(taskName, assignee, status);
    }
    setFormData({
      taskName: "",
      assignee: "",
      status: "",
    });

    navigate("/");
  };

  const host = "http://localhost:5000";
  useEffect(() => {
    const getUserNameById = async () => {
      try {
        const response = await fetch(`${host}/api/users/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        });
        const usersList = await response.json();
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };
    if (isAdmin) {
      getUserNameById();
    }
  }, [isAdmin]);

  return (
    <div className="w-fit rounded-3xl mt-3 bg-white p-4 mb-5">
      <h1 className="text-2xl font-bold pl-4">Create new task</h1>
      <form className="flex items-center p-4 gap-3">
        <div>
          <FormField
            title="Task"
            inputValue={taskName}
            updateValue={(value) =>
              setFormData((prevState) => ({ ...prevState, taskName: value }))
            }
            placeholder="Enter task name"
          />
        </div>
        <div>
          <label
            htmlFor="assignee"
            className="block text-sm mb-2 font-medium text-gray-700 uppercase"
          >
            Assigned to
          </label>
          <UserDropdown
            assignee={assignee}
            updateValue={(value) =>
              setFormData((prevState) => ({ ...prevState, assignee: value }))
            }
            optionList={users}
          />
        </div>

        <div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm mb-2 font-medium text-gray-700 uppercase"
            >
              Status
            </label>
            <DropDown
              value={status}
              updateValue={(value) =>
                setFormData((prevState) => ({ ...prevState, status: value }))
              }
              optionList={statusList}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-6"
            onClick={handleClick}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddTask;

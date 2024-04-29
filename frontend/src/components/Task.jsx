import { MdOutlineDelete } from "react-icons/md";
import { UserContext } from "../context/users/UserContext";
import { useContext, useEffect, useState } from "react";
import TableData from "./TableData";
import DropDown from "./DropDown";
import Badge from "./Badge";

const Task = ({ task }) => {
  const context = useContext(UserContext);
  const { deleteTask, requestForApproval, isAdmin } = context;
  const { taskName, assignedTo, status } = task;

  const [newFormData, setNewFormData] = useState({
    newStatus: status,
  });

  const { newStatus } = newFormData;
  const statusList = ["COMPLETED", "IN PROGRESS", "INITIATED", "INCOMPLETE"];

  const [assignedToName, setAssignedToName] = useState("");
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
        const users = await response.json();
        const assignedUser = users.find((user) => user._id === assignedTo);
        if (assignedUser) {
          setAssignedToName(assignedUser.name);
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    if (isAdmin) {
      getUserNameById();
    }
  }, [isAdmin, assignedTo]);

  return (
    <tbody className="divide-y divide-gray-200">
      <tr>
        <TableData value={taskName} />

        {isAdmin && (
          <>
            <TableData value={assignedToName} />
            <TableData value={<Badge title={status.toUpperCase()} />} />
            <TableData
              value={
                <button
                  onClick={() => deleteTask(task._id)}
                  type="button"
                  className=" text-red-600 hover:text-white hover:bg-red-600 disabled:pointer-events-none text-lg border-2 border-red-600 rounded-full p-1 ml-3"
                >
                  <MdOutlineDelete />
                </button>
              }
            />
          </>
        )}

        {!isAdmin && (
          <>
            <TableData
              value={
                <DropDown
                  value={newStatus.toUpperCase()}
                  updateValue={(value) =>
                    setNewFormData((prevState) => ({
                      ...prevState,
                      newStatus: value,
                    }))
                  }
                  optionList={statusList}
                />
              }
            />
            <TableData
              value={
                <button
                  onClick={() => {
                    requestForApproval(newStatus, task._id);
                    console.log(newStatus);
                  }}
                  type="submit"
                  className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-3xl text-[#e85d04] bg-[#ffee99] hover:bg-[#ffe14c] "
                >
                  Request for approval
                </button>
              }
            />
          </>
        )}
      </tr>
    </tbody>
  );
};
export default Task;

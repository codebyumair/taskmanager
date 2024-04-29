import { MdOutlineDelete } from "react-icons/md";
import { UserContext } from "../context/users/UserContext";
import { useContext, useEffect, useState } from "react";
import TableData from "./TableData";
import DropDown from "./DropDown";
import Badge from "./Badge";

const PendingTask = ({ pendingTask, handleApprove, handleReject }) => {
  const context = useContext(UserContext);
  const { isAdmin } = context;
  console.log(pendingTask);
  //   const [newFormData, setNewFormData] = useState({
  //     newStatus: pendingTask.statusChangeRequest.newStatus,
  //   });

  const [assignedToName, setAssignedToName] = useState("");
  const [newStatus, setNewStatus] = useState("");

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
        const assignedUser = users.find(
          (user) => user._id === pendingTask.assignedTo
        );
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
  }, [isAdmin, pendingTask.assignedTo]);

  const handleApproveClick = () => {
    handleApprove(pendingTask._id, true, newStatus);
  };

  const handleRejectClick = () => {
    handleReject(pendingTask._id);
  };

  return (
    <tbody className="divide-y divide-gray-200">
      <tr>
        <TableData value={pendingTask.taskName} />
        <TableData value={assignedToName} />
        <TableData value={pendingTask.status} />

        <TableData value={pendingTask.statusChangeRequest.newStatus} />
        <TableData
          value={
            <>
              <button
                className="border-[1px] border-green-900 text-green-900 bg-green-300 inline-flex items-center justify-center px-3 py-2 font-bold leading-none rounded-full mr-2 uppercase text-xs"
                onClick={handleApproveClick}
              >
                Approve
              </button>
              <button
                className="border-[1px] border-red-600  text-red-600 bg-red-200 inline-flex items-center justify-center px-3 py-2 font-bold leading-none rounded-full uppercase text-xs"
                onClick={handleRejectClick}
              >
                Reject
              </button>
            </>
          }
        />
      </tr>
    </tbody>
  );
};
export default PendingTask;

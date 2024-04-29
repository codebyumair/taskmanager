import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/users/UserContext";
import { toast } from "react-toastify";
import TableHeading from "./TableHeading";
import PendingTask from "./PendingTask";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const Pending = () => {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const { isAdmin, tasks, approvedStatusChange, getTasks } = context;
  const [isLoading, setIsLoading] = useState(true);
  const [pendingTasks, setPendingTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await getTasks();
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      const pendingTasks = tasks.filter((task) => task.statusChangeRequest);
      setPendingTasks(pendingTasks);
      setIsLoading(false);
    } else {
      fetchData();
    }
  }, [isAdmin, tasks, getTasks]);

  const handleApprove = async (taskId, approved, newStatus) => {
    try {
      toast.info("Approving request...");
      await approvedStatusChange(taskId, approved, newStatus);
      toast.success("Request approved successfully");
    } catch (error) {
      toast.error("Failed to approve request");
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (taskId) => {
    try {
      navigate("/");
      toast.info("Rejecting request...");
      await approvedStatusChange(taskId, false);
      toast.success("Request rejected successfully");
    } catch (error) {
      toast.error("Failed to reject request");
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <>
      <div className="w-full h-full">
        <header className="w-full p-5 bg-white flex justify-between ">
          <h1 className="text-2xl font-bold">Pending tasks</h1>
        </header>
        <div className="p-5 min-w-full inline-block align-middle">
          {isLoading && <Spinner />}
          <div className="overflow-hidden bg-white rounded-3xl">
            {pendingTasks.length === 0 ? (
              <div className="w-full h-[450px] flex items-center justify-center">
                <h1 className="text-2xl">No tasks for approval</h1>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <TableHeading value="Task" />
                    <TableHeading value="Assignee" />
                    <TableHeading value="Current Status" />
                    <TableHeading value="Requested Status" />

                    <TableHeading value="Action" />
                  </tr>
                </thead>
                {pendingTasks.map((task, index) => (
                  <PendingTask
                    key={task._id}
                    pendingTask={task}
                    handleApprove={handleApprove}
                    handleReject={handleReject}
                  />
                ))}
              </table>
            )}
          </div>
        </div>
      </div>
      {/* <ul>
        {pendingTasks.map((task) => (
          <li key={task._id} className="flex bg-white">
            <div>Task Name: {task.taskName}</div>
            <div>Assigned To: {task.assignedTo}</div>
            <div>Requested By: {task.statusChangeRequest.requestedBy}</div>
            <div>New Status: {task.statusChangeRequest.newStatus}</div>
            <button onClick={() => handleApprove(task._id, true)}>
              Approve
            </button>
            <button onClick={() => handleReject(task._id)}>Reject</button>
          </li>
        ))}
      </ul> */}
    </>
  );
};

export default Pending;

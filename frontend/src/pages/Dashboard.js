import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/users/UserContext";
import { useNavigate } from "react-router-dom";
import Task from "../components/Task";
import AddTask from "../components/AddTask";
import TableHeading from "../components/TableHeading";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const { tasks, isAdmin, getTasks } = context;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (localStorage.getItem("token")) {
          await getTasks();
        } else {
          navigate("/login");
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full">
      <header className="w-full p-5 bg-white flex justify-between ">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>
      <div className="p-5 min-w-full inline-block align-middle">
        {isAdmin && <AddTask />}
        <div className="overflow-hidden bg-white rounded-3xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <TableHeading value="Task" />
                {isAdmin && (
                  <>
                    <TableHeading value="Assignee" />
                    <TableHeading value="Status" />
                    <TableHeading value="Action" />
                  </>
                )}
                {!isAdmin && (
                  <>
                    <TableHeading value="Status" />
                    <TableHeading value="Action" />
                  </>
                )}
              </tr>
            </thead>
            {tasks.map((task, index) => {
              return <Task key={index} task={task} />;
            })}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

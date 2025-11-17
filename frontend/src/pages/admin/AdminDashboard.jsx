import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [educators, setEducators] = useState([]);

  // ✅ Fetch all users and separate tables
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/admin/users`, {
        withCredentials: true,
      });

      const data = res.data;

      setStudents(data.filter((u) => u.role === "student"));
      setEducators(data.filter((u) => u.role === "educator"));
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  // ✅ Toggle status instantly without UI lag
  const handleToggleStatus = async (userId, role) => {
    try {
      const res = await axios.put(
        `${serverUrl}/api/admin/toggle/${userId}`,
        {},
        { withCredentials: true }
      );

      toast.success(res.data.message);

      if (role === "student") {
        setStudents((prev) =>
          prev.map((u) =>
            u._id === userId
              ? { ...u, status: u.status === "active" ? "inactive" : "active" }
              : u
          )
        );
      } else if (role === "educator") {
        setEducators((prev) =>
          prev.map((u) =>
            u._id === userId
              ? { ...u, status: u.status === "active" ? "inactive" : "active" }
              : u
          )
        );
      }
    } catch (err) {
      toast.error("Error updating user status");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // -----------------------------------------
  // REUSABLE TABLE COMPONENT
  // -----------------------------------------
  const UserTable = ({ title, users, role }) => (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Last Login</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">
                  {new Date(u.lastLogin).toLocaleDateString()}
                </td>

                <td
                  className={`p-2 border font-semibold ${
                    u.status === "active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {u.status}
                </td>

                <td className="p-2 border">
                  <button
                    onClick={() => handleToggleStatus(u._id, role)}
                    className={`px-3 py-1 rounded ${
                      u.status === "active"
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {u.status === "active"
                      ? "Set Inactive"
                      : "Set Active"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Student Table */}
      <UserTable
        title="Student List"
        users={students}
        role="student"
      />

      {/* Educator Table */}
      <UserTable
        title="Educator List"
        users={educators}
        role="educator"
      />
    </div>
  );
};

export default AdminDashboard;
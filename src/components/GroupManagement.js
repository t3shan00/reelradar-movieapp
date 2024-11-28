import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./styles/GroupManagement.css";

const GroupManagement = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchGroups();
    fetchUserGroups();
  }, []);

  const fetchUserGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3001/api/groups/my-groups",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserGroups(response.data);
    } catch (err) {
      console.error("Failed to load user groups:", err);
      setError("Failed to load user groups. Please try again.");
    }
  };

  const fetchGroups = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3001/api/groups?page=${page}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGroups(response.data.groups);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      });
    } catch (err) {
      console.error("Failed to load groups:", err);
      setError("Failed to load groups. Please try again.");
    }
  };

  const joinGroup = async (groupId) => {
    if (!groupId) {
      setError("Group ID is missing.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      await axios.post(
        `http://localhost:3001/api/groups/${groupId}/join`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Join request sent successfully");
      fetchGroups();
      fetchUserGroups();
    } catch (err) {
      console.error("Failed to join group:", err);
      setError("Failed to join group. Please try again.");
    }
  };

  const viewGroup = (group) => {
    navigate(`/groups/${group.group_id}`);
  };

  const manageGroup = (group) => {
    navigate(`/groups/${group.group_id}/manage`);
  };

  const leaveGroup = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const groupResponse = await axios.get(
        `http://localhost:3001/api/groups/${groupId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const group = groupResponse.data;

      if (group.created_by === userId) {
        await deleteGroup(groupId);
      } else {
        await axios.delete(
          `http://localhost:3001/api/groups/${groupId}/leave`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Left group");
      }

      fetchGroups();
      fetchUserGroups();
    } catch (err) {
      console.error("Failed to leave group:", err);
      setError("Failed to leave group. Please try again.");
    }
  };

  const createGroup = async () => {
    if (!newGroupName) {
      setError("Please enter a group name.");
      return;
    }

    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:3001/api/groups",
        { groupName: newGroupName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchGroups();
      fetchUserGroups();
      setNewGroupName("");
      alert("Group created and joined successfully!");
    } catch (err) {
      console.error("Failed to create group:", err);
      setError("Failed to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Group deleted");
      fetchGroups();
      fetchUserGroups();
    } catch (err) {
      console.error("Failed to delete group:", err.message);
      setError("Failed to delete group. Please try again.");
    }
  };

  const handlePageChange = (newPage) => {
    fetchGroups(newPage);
  };

  const userGroupIds = userGroups.map(group => group.group_id);
  const filteredGroups = groups.filter(group => !userGroupIds.includes(group.group_id));

  return (
    <div className="container">
      <h1>Group Management</h1>
      {error && <p className="error">{error}</p>}
      <div className="new-group-form">
        <h2>Create New Group</h2>
        <input
          type="text"
          placeholder="Enter group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <button onClick={createGroup} disabled={loading}>
          {loading ? "Creating..." : "Create Group"}
        </button>
      </div>
      <h2>My Groups</h2>
      <ul className="group-list">
        {userGroups.map((group) => (
          <li key={group.group_id}>
            <span>{group.name}</span>
            <div className="group-actions">
              <button onClick={() => viewGroup(group)}>View</button>
              {group.created_by === Number(localStorage.getItem("userId")) && (
                <>
                  <button className="manage-button" onClick={() => manageGroup(group)}>Manage</button>
                </>
              )}
              {group.created_by !== Number(localStorage.getItem("userId")) && (
              <button className="leave-button" onClick={() => leaveGroup(group.group_id)}>Leave Group</button>
              )}
              {group.created_by === Number(localStorage.getItem("userId")) && (
                <button className="leave-button" onClick={() => deleteGroup(group.group_id)}>Delete Group</button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <h2>All Groups</h2>
      <ul className="group-list">
        {filteredGroups.map((group) => (
          <li key={group.group_id}>
            <span>{group.name}</span>
            <div className="group-actions">
              <button className="join-button" onClick={() => joinGroup(group.group_id)}>Join</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button
          onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
          disabled={pagination.currentPage === 1}
        >
          Previous
        </button>
        <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
        <button
          onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GroupManagement;
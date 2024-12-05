import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './styles/GroupManagement.module.css';

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
      toast.error("Failed to load user groups. Please try again.");
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
      toast.error("Failed to load groups. Please try again.");
      setError("Failed to load groups. Please try again.");
    }
  };

  const joinGroup = async (groupId) => {
    if (!groupId) {
      toast.error("Group ID is missing.");
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
      toast.success("Join request sent successfully!");
      fetchGroups();
      fetchUserGroups();
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.warning("Join request already sent.");
      } else {
        console.error("Failed to join group:", err);
        toast.error("Failed to join group. Please try again.");
      }
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
        toast.success("Successfully left the group");
      }

      fetchGroups();
      fetchUserGroups();
    } catch (err) {
      console.error("Failed to leave group:", err);
      toast.error("Failed to leave group. Please try again.");
    }
  };

  const createGroup = async () => {
    if (!newGroupName) {
      toast.warning("Please enter a group name.");
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

      toast.success("Group created and joined successfully!");
      fetchGroups();
      fetchUserGroups();
      setNewGroupName("");
    } catch (err) {
      console.error("Failed to create group:", err);
      toast.error("Failed to create group. Please try again.");
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
      toast.success("Group deleted successfully");
      fetchGroups();
      fetchUserGroups();
    } catch (err) {
      console.error("Failed to delete group:", err.message);
      toast.error("Failed to delete group. Please try again.");
    }
  };

  const handlePageChange = (newPage) => {
    fetchGroups(newPage);
  };

  const userGroupIds = userGroups.map(group => group.group_id);
  const filteredGroups = groups.filter(group => !userGroupIds.includes(group.group_id));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Group Management</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.newGroupForm}>
        <h2 className={styles.subtitle}>Create New Group</h2>
        <input
          type="text"
          placeholder="Enter group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className={styles.input}
        />
        <button onClick={createGroup} disabled={loading} className={styles.button}>
          {loading ? "Creating..." : "Create Group"}
        </button>
      </div>
      <h2 className={styles.subtitle}>My Groups</h2>
      <ul className={styles.groupList}>
        {userGroups.map((group) => (
          <li key={group.group_id} className={styles.groupItem}>
            <span>{group.name}</span>
            <div className={styles.groupActions}>
              <button onClick={() => viewGroup(group)} className={styles.button}>View</button>
              {group.created_by === Number(localStorage.getItem("userId")) && (
                <button className={styles.manageButton} onClick={() => manageGroup(group)}>Manage</button>
              )}
              {group.created_by !== Number(localStorage.getItem("userId")) && (
                <button className={`${styles.button} ${styles.leaveButton}`} onClick={() => leaveGroup(group.group_id)}>Leave Group</button>
              )}
              {group.created_by === Number(localStorage.getItem("userId")) && (
                <button className={`${styles.button} ${styles.leaveButton}`} onClick={() => deleteGroup(group.group_id)}>Delete Group</button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <h2 className={styles.subtitle}>All Groups</h2>
      <ul className={styles.groupList}>
        {filteredGroups.map((group) => (
          <li key={group.group_id} className={styles.groupItem}>
            <span>{group.name}</span>
            <div className={styles.groupActions}>
              <button className={`${styles.button} ${styles.joinButton}`} onClick={() => joinGroup(group.group_id)}>Join</button>
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className={styles.button}
        >
          Previous
        </button>
        <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className={styles.button}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GroupManagement;
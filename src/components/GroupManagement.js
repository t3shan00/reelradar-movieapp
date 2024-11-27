import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/GroupManagement.css";

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });

  useEffect(() => {
    fetchGroups();
    fetchUserGroups();
  }, []);

  //fetch groups joined by user
  const fetchUserGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/api/groups/my-groups", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserGroups(response.data);
    } catch (err) {
      console.error("Failed to load user groups:", err);
      setError("Failed to load user groups. Please try again.");
    }
  };

  //fetch all groups
  const fetchGroups = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3001/api/groups?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroups(response.data.groups);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages
      });
    } catch (err) {
      console.error("Failed to load groups:", err);
      setError("Failed to load groups. Please try again.");
    }
  };

  //join group function
  const joinGroup = async (groupId) => {
    console.log("Joining group with ID:", groupId);  // Debugging
    if (!groupId) {
      setError("Group ID is missing.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      console.log("Request details:", {
        url: `http://localhost:3001/api/groups/${groupId}/join`,
        userId: userId,
        token: token
      });
  
      const response = await axios.post(
        `http://localhost:3001/api/groups/${groupId}/join`, 
        { userId }, // Include userId in the request body if required
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      alert("Join request sent successfully");
      fetchGroups();
      fetchUserGroups();
    } catch (err) {
      console.error("Full error:", err);
      console.error("Error response:", err.response);
      
      const errorMessage = err.response?.data?.error || 
                           err.response?.data?.message || 
                           err.message || 
                           "Failed to join group. Please try again.";
      
      console.error("Detailed error message:", errorMessage);
      setError(errorMessage);
      alert(errorMessage);
    }
  };
  
  //view group details
  const viewGroup = (group) => {
    setSelectedGroup(group);
  };

  //leave group function
  const leaveGroup = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      // Fetch the group details to check if the user is the creator
      const groupResponse = await axios.get(`http://localhost:3001/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const group = groupResponse.data;
  
      // Check if the user is the creator of the group
      if (group.created_by === userId) {
        // User is the creator, so delete the group
        await deleteGroup(groupId);
      } else {
        // User is not the creator, just leave the group
        await axios.delete(`http://localhost:3001/api/groups/${groupId}/leave`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Left group");
      }
  
      fetchGroups();
      fetchUserGroups();
      setSelectedGroup(null);
    } catch (err) {
      console.error("Failed to leave group:", err);
      setError("Failed to leave group. Please try again.");
    }
  };

  //creating a group
  const createGroup = async () => {
    if (!newGroupName) {
      setError("Please enter a group name.");
      return;
    }
  
    setLoading(true);
    setError("");
  
    const token = localStorage.getItem("token");
  
    try {
      const response = await axios.post(
        "http://localhost:3001/api/groups", 
        { groupName: newGroupName }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Assuming the response returns the created group's details
      const createdGroup = response.data; // This will contain the entire group object
  
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

  //delete group function
  const deleteGroup = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Group deleted");
      setSelectedGroup(null);
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

  return (
    <div>
      <h1>Group Management</h1>
      {error && <p className="error-message">{error}</p>}
      
      <h2>Your Groups</h2>
      <ul>
        {userGroups.map((group) => (
          <li key={group.group_id}>
            {group.name}
            <button onClick={() => viewGroup(group)}>View</button>
            <button onClick={() => leaveGroup(group.group_id)}>Leave Group</button>
          </li>
        ))}
      </ul>

      <h2>Available Groups</h2>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            {group.name}
            <button onClick={() => viewGroup(group)}>View</button>
            <button onClick={() => joinGroup(group.group_id)}>Join</button>
          </li>
        ))}
      </ul>

      {/* Pagination Controls
      <div>
        <button 
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
        >
          Previous
        </button>
        <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
        <button 
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
        </button>
      </div> */}

      {selectedGroup && (
        <div>
          <h3>Group: {selectedGroup.name}</h3>
          <button onClick={() => leaveGroup(selectedGroup.id)}>Leave Group</button>
          {selectedGroup.created_by === localStorage.getItem('userId') && (
            <button onClick={() => deleteGroup(selectedGroup.id)}>Delete Group</button>
          )}
        </div>
      )}

      <div>
        <h2>Create a New Group</h2>
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Enter group name"
        />
        <button onClick={createGroup} disabled={loading}>
          {loading ? "Creating..." : "Create Group"}
        </button>
      </div>
    </div>
  );
};

export default GroupManagement;
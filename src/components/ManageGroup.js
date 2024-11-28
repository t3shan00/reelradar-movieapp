import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './styles/ManageGroup.css';

const ManageGroup = () => {
  const { groupId } = useParams();
  const [joinRequests, setJoinRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJoinRequests();
  }, [groupId]);

  const fetchJoinRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:3001/api/groups/${groupId}/join-requests`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJoinRequests(response.data);
    } catch (err) {
      console.error("Failed to fetch join requests:", err);
      setError("Failed to fetch join requests. Please try again.");
    }
  };

  const handleRequest = async (requestId, status) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Debugging line
      console.log(`Handling request ID: ${requestId} with status: ${status}`); // Debugging line
      const url = `http://localhost:3001/api/groups/join-requests/${requestId}`;
      console.log("Request URL:", url); // Debugging line
      const response = await axios.put(url, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Handle request response status:", response.status); // Debugging line
      console.log("Handle request response data:", response.data); // Debugging line
      fetchJoinRequests();
    } catch (err) {
      console.error("Failed to manage join request:", err);
      setError("Failed to manage join request. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Manage Join Requests</h1>
      {error && <p className="error">{error}</p>}
      <ul className="request-list">
        {joinRequests.map((request) => (
          <li key={request.request_id}>
            <span>{request.username}</span>
            <div className="request-actions">
              <button onClick={() => handleRequest(request.request_id, 'accepted')}>Accept</button>
              <button onClick={() => handleRequest(request.request_id, 'rejected')}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageGroup;
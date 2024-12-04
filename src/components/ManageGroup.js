import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './styles/ManageGroup.css';

const ManageGroup = () => {
  const { groupId } = useParams();
  const [joinRequests, setJoinRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');

  const fetchJoinRequests = useCallback(async () => {
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
  }, [groupId]);

  const fetchGroupMembers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:3001/api/groups/${groupId}/members`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(response.data);
    } catch (err) {
      console.error("Failed to fetch group members:", err);
      setError("Failed to fetch group members. Please try again.");
    }
  }, [groupId]);

  useEffect(() => {
    fetchJoinRequests();
    fetchGroupMembers();
  }, [fetchJoinRequests, fetchGroupMembers]);

  const handleRequest = async (requestId, status) => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:3001/api/groups/join-requests/${requestId}`;
      await axios.put(url, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJoinRequests();
      fetchGroupMembers();
    } catch (err) {
      console.error("Failed to manage join request:", err);
      setError("Failed to manage join request. Please try again.");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:3001/api/groups/${groupId}/members/${memberId}`;
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGroupMembers();
      setPopupMessage("Member removed successfully.");
      setTimeout(() => setPopupMessage(''), 3000); 
    } catch (err) {
      console.error("Failed to remove member:", err);
      setError("Failed to remove member. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Manage Group</h1>
      {error && <p className="error">{error}</p>}
      {popupMessage && <div className="popup">{popupMessage}</div>}
      <h2>Join Requests</h2>
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
      <h2>Group Members</h2>
      <ul className="member-list">
        {members.map((member) => (
          <li key={member.user_id}>
            <span>{member.username}</span>
            <button onClick={() => handleRemoveMember(member.user_id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageGroup;
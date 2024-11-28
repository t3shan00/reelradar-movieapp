import { pool } from "../utils/db.js";

// Create a new group and automatically add the creator to group_members
export const createGroupInDB = async (groupName, createdBy) => {
  const client = await pool.connect(); // Get a client from the pool
  try {
    await client.query('BEGIN'); // Start a transaction

    // Insert the new group
    const groupQuery = 'INSERT INTO groups (name, created_by) VALUES ($1, $2) RETURNING *';
    const groupResult = await client.query(groupQuery, [groupName, createdBy]);
    const createdGroupId = groupResult.rows[0].group_id; // Get the created group's ID

    // Insert the creator into group_members
    const memberQuery = 'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)';
    await client.query(memberQuery, [createdGroupId, createdBy]);

    await client.query('COMMIT'); // Commit the transaction
    return groupResult; // Return the result of the group creation
  } catch (err) {
    await client.query('ROLLBACK'); // Rollback the transaction on error
    console.error("Error creating group:", err.message);
    throw new Error("Failed to create group and add creator to group members.");
  } finally {
    client.release(); // Release the client back to the pool
  }
};

// Fetch all groups with optional pagination
export const fetchAllGroups = async (limit = 10, offset = 0) => {
  const query = 'SELECT * FROM groups LIMIT $1 OFFSET $2';
  return await pool.query(query, [limit, offset]);
};

// Count total groups for pagination
export const countTotalGroups = async () => {
  const query = 'SELECT COUNT(*) FROM groups';
  const result = await pool.query(query);
  return parseInt(result.rows[0].count);
};

//fetch group by ID
export const fetchGroupById = async (groupId) => {
  const query = `SELECT * FROM groups WHERE group_id = $1`;
  return pool.query(query, [groupId]);
};

// Delete a group by ID
export const deleteGroupById = async (groupId) => {
  const query = `DELETE FROM groups WHERE group_id = $1`;
  return pool.query(query, [groupId]);
};

// Check if user is already a member of a group
export const checkUserMembership = async (userId, groupId) => {
  const query = 'SELECT * FROM group_members WHERE user_id = $1 AND group_id = $2';
  const result = await pool.query(query, [userId, groupId]);
  return result.rowCount > 0;
};

// Add join request
export const addJoinRequest = async (userId, groupId) => {
  const existingRequestQuery = 'SELECT * FROM join_requests WHERE user_id = $1 AND group_id = $2';
  const existingRequest = await pool.query(existingRequestQuery, [userId, groupId]);
  
  if (existingRequest.rowCount > 0) {
    const error = new Error('Join request already exists');
    error.code = 'JOIN_REQUEST_EXISTS';
    throw error;
  }

  const query = 'INSERT INTO join_requests (user_id, group_id) VALUES ($1, $2)';
  return await pool.query(query, [userId, groupId]);
};

// Remove a member from a group
export const removeMemberFromGroup = async (groupId, memberId, ownerId) => {
  const ownerCheckQuery = 'SELECT * FROM groups WHERE group_id = $1 AND created_by = $2';
  const ownerCheck = await pool.query(ownerCheckQuery, [groupId, ownerId]);
  
  if (ownerCheck.rowCount === 0) {
    throw new Error('Not authorized to remove members');
  }

  const query = 'DELETE FROM group_members WHERE group_id = $1 AND user_id = $2';
  return await pool.query(query, [groupId, memberId]);
};

// Get user's groups
export const getUserGroups = async (userId) => {
  const query = `
    SELECT g.* 
    FROM groups g
    JOIN group_members gm ON g.group_id = gm.group_id
    WHERE gm.user_id = $1
  `;
  return await pool.query(query, [userId]);
};

// Leave a group
export const leaveGroupModel = async (userId, groupId) => {
  const query = 'DELETE FROM group_members WHERE user_id = $1 AND group_id = $2';
  return await pool.query(query, [userId, groupId]);
};

// Fetch join requests for a group from the database
export const fetchJoinRequestsFromDB = async (groupId) => {
  const query = `
    SELECT jr.request_id, jr.user_id, u.username, jr.created_at, jr.status
    FROM join_requests jr
    JOIN users u ON jr.user_id = u.userid
    WHERE jr.group_id = $1 AND jr.status = 'pending'
  `;
  try {
    const result = await pool.query(query, [groupId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Update the status of a join request in the database
export const updateJoinRequestStatus = async (requestId, status) => {
  const query = `
    UPDATE join_requests
    SET status = $1
    WHERE request_id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [status, requestId]);
  return result.rows[0];
};

// Update join request status and add user to group members if accepted
export const handleJoinRequestInDB = async (requestId, status) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const joinRequestQuery = 'SELECT * FROM join_requests WHERE request_id = $1';
    const joinRequestResult = await client.query(joinRequestQuery, [requestId]);

    if (joinRequestResult.rowCount === 0) {
      throw new Error("Join request not found.");
    }

    const joinRequest = joinRequestResult.rows[0];

    // Update the join request status
    const updateQuery = `
      UPDATE join_requests
      SET status = $1
      WHERE request_id = $2
      RETURNING *
    `;
    const result = await client.query(updateQuery, [status, requestId]);

    // If the request is accepted, add the user to the group members
    if (status === 'accepted') {
      const addMemberQuery = 'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING';
      await client.query(addMemberQuery, [joinRequest.group_id, joinRequest.user_id]);
    }

    // Delete the join request
    const deleteQuery = 'DELETE FROM join_requests WHERE request_id = $1';
    await client.query(deleteQuery, [requestId]);

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Fetch members of a group
export const fetchGroupMembers = async (groupId) => {
  const query = `
    SELECT gm.user_id, u.username
    FROM group_members gm
    JOIN users u ON gm.user_id = u.userid
    WHERE gm.group_id = $1
  `;
  const result = await pool.query(query, [groupId]);
  return result.rows;
};
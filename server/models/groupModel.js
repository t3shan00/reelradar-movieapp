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

// Fetch a specific group by ID
export const fetchGroupById = async (id) => {
  const query = 'SELECT * FROM groups WHERE group_id = $1';
  return await pool.query(query, [id]);
};

// Delete a group by ID
export const deleteGroupById = async (id) => {
  const query = 'DELETE FROM groups WHERE group_id = $1 RETURNING *';
  return await pool.query(query, [id]);
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
    throw new Error('Join request already exists');
  }

  const query = 'INSERT INTO join_requests (user_id, group_id) VALUES ($1, $2)';
  return await pool.query(query, [userId, groupId]);
};

// Update membership status
export const updateMembershipStatus = async (groupId, userId, action) => {
  if (action === "accept") {
    const insertQuery = 'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING';
    await pool.query(insertQuery, [groupId, userId]);
    
    const deleteRequestQuery = 'DELETE FROM join_requests WHERE group_id = $1 AND user_id = $2';
    await pool.query(deleteRequestQuery, [groupId, userId]);
  } else {
    const deleteRequestQuery = 'DELETE FROM join_requests WHERE group_id = $1 AND user_id = $2';
    await pool.query(deleteRequestQuery, [groupId, userId]);
  }
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
import {
  createGroupInDB,
  fetchAllGroups,
  fetchGroupById,
  deleteGroupById,
  removeMemberFromGroup,
  getUserGroups,
  countTotalGroups,
  leaveGroupModel,
  addJoinRequest,
  checkUserMembership,
  fetchJoinRequestsFromDB, 
  updateJoinRequestStatus,
  handleJoinRequestInDB,
  fetchGroupMembers
} from "../models/groupModel.js";

// Create a new group
export const createGroup = async (req, res) => {
  const { groupName } = req.body;
  const createdBy = req.userId; // Get the user ID from the request

  if (!groupName) {
    return res.status(400).json({ error: "Group name is required." });
  }

  try {
    // Call the modified createGroupInDB function
    const result = await createGroupInDB(groupName, createdBy);
    
    // The result will contain the created group details
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating group:", err.message);
    res.status(500).json({ error: "Failed to create group.", details: err.message });
  }
};

// Get all groups with pagination
export const getGroups = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const result = await fetchAllGroups(Number(limit), Number(offset));
    const totalGroups = await countTotalGroups();

    res.status(200).json({
      groups: result.rows,
      totalPages: Math.ceil(totalGroups / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    console.error("Error fetching groups:", err.message);
    res.status(500).json({ error: "Failed to fetch groups.", details: err.message });
  }
};

// Get details of a specific group by ID
export const getGroupDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await fetchGroupById(id);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Group not found." });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching group details:", err.message);
    res.status(500).json({ error: "Failed to fetch group details.", details: err.message });
  }
};

// Delete a group by ID
export const deleteGroup = async (req, res) => {
  const { id } = req.params; // Group ID from URL params
  const userId = req.userId;  // User ID from auth middleware

  try {
    // Fetch group by ID
    const groupResult = await fetchGroupById(id);

    if (groupResult.rowCount === 0) {
      return res.status(404).json({ error: "Group not found." });
    }

    const group = groupResult.rows[0];

    // Check if the requesting user is the creator of the group
    if (group.created_by !== userId) {
      return res.status(403).json({ error: "You do not have permission to delete this group." });
    }

    // Delete the group
    await deleteGroupById(id);
    res.status(204).end(); // No Content response on successful deletion
  } catch (err) {
    console.error("Error deleting group:", err.message);
    res.status(500).json({ error: "Failed to delete group.", details: err.message });
  }
};


// Send a join request
export const requestToJoinGroup = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.userId;

  try {
    // Check if group exists
    const groupResult = await fetchGroupById(groupId);
    if (groupResult.rowCount === 0) {
      return res.status(404).json({ error: "Group not found." });
    }

    // Check if user is already a member
    const isMember = await checkUserMembership(userId, groupId);
    if (isMember) {
      return res.status(400).json({ error: "You are already a member of this group." });
    }

    await addJoinRequest(userId, groupId);
    res.status(200).json({ message: "Join request sent." });
  } catch (err) {
    if (err.code === 'JOIN_REQUEST_EXISTS') {
      return res.status(409).json({ error: "Join request already sent." });
    }
    console.error("Error requesting to join group:", err.message);
    res.status(500).json({ 
      error: "Failed to send join request.", 
      details: err.message 
    });
  }
};

// Fetch join requests for a group
export const fetchJoinRequests = async (req, res) => {
  const { groupId } = req.params;

  try {
    const result = await fetchJoinRequestsFromDB(groupId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching join requests:', error);
    res.status(500).json({ message: 'Error fetching join requests', error: error.message });
  }
};

// Handle join request (accept/reject)
export const handleJoinRequest = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status. Must be 'accepted' or 'rejected'." });
  }

  try {
    const result = await handleJoinRequestInDB(requestId, status);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error handling join request:', error);
    res.status(500).json({ message: 'Error handling join request', error: error.message });
  }
};

// Remove member from group
export const removeMember = async (req, res) => {
  const { groupId, memberId } = req.params;
  const ownerId = req.userId;

  try {
    await removeMemberFromGroup(groupId, memberId, ownerId);
    res.status(200).json({ message: "Member removed successfully." });
  } catch (err) {
    console.error("Error removing member:", err.message);
    res.status(500).json({ error: "Failed to remove member.", details: err.message });
  }
};

// Get user's groups
export const getMyGroups = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await getUserGroups(userId);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching user's groups:", err.message);
    res.status(500).json({ error: "Failed to fetch user's groups.", details: err.message });
  }
};

// Leave a group
export const leaveGroup = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.userId;

  try {
    // Check if user is a member of the group
    const isMember = await checkUserMembership(userId, groupId);
    if (!isMember) {
      return res.status(400).json({ error: "You are not a member of this group." });
    }

    await leaveGroupModel(userId, groupId);
    res.status(200).json({ message: "Successfully left the group." });
  } catch (err) {
    console.error("Error leaving group:", err.message);
    res.status(500).json({ error: "Failed to leave group.", details: err.message });
  }
};

// Fetch members of a group
export const getGroupMembers = async (req, res) => {
  const { groupId } = req.params;

  try {
    const members = await fetchGroupMembers(groupId);
    res.status(200).json(members);
  } catch (err) {
    console.error("Error fetching group members:", err.message);
    res.status(500).json({ error: "Failed to fetch group members.", details: err.message });
  }
};
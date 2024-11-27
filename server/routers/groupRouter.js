import express from 'express';
import {
  createGroup,
  getGroups,
  getGroupDetails,
  deleteGroup,
  requestToJoinGroup,
  handleJoinRequest,
  removeMember,
  getMyGroups,
  leaveGroup
} from '../controllers/groupController.js';
import { auth } from '../utils/auth.js';

const router = express.Router();

router.use(auth);

// Create a new group
router.post('/', createGroup);

// Get all groups
router.get('/', getGroups);

// Get my groups
router.get('/my-groups', getMyGroups);

// Get group details by ID
router.get('/:id', getGroupDetails);

// Join Group
router.post('/:groupId/join', requestToJoinGroup);

// Delete a group by ID
router.delete('/:id', deleteGroup);

// Request to join a group
router.post('/:groupId/join', requestToJoinGroup);

// Leave a group
router.delete('/:groupId/leave', leaveGroup);

// Handle join request
router.post('/join-request', handleJoinRequest);

// Remove a member from a group
router.delete('/:groupId/members/:memberId', removeMember);

export default router;

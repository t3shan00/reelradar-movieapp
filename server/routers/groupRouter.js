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

const groupRouter = express.Router();

groupRouter.use(auth);

// Create a new group
groupRouter.post('/', createGroup);

// Get all groups
groupRouter.get('/', getGroups);

// Get my groups
groupRouter.get('/my-groups', getMyGroups);

// Get group details by ID
groupRouter.get('/:id', getGroupDetails);

// Delete a group by ID
groupRouter.delete('/:id', auth, deleteGroup);

// Request to join a group
groupRouter.post('/:groupId/join', requestToJoinGroup);

// Leave a group
groupRouter.delete('/:groupId/leave', leaveGroup);

// Handle join request
groupRouter.post('/join-request', handleJoinRequest);

// Remove a member from a group
groupRouter.delete('/:groupId/members/:memberId', removeMember);

export default groupRouter;

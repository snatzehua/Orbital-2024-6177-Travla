const express = require('express');
const { fetchUsers, createUser, updateUser, deleteUser, fetchUserById } = require('../controllers/userController');
const router = express.Router();

// GET all users
router.get('/users', fetchUsers);

// GET user by ID
router.get('/users/:uid', fetchUserById);

// POST create a new user
router.post('/users', createUser);

// PUT update user by ID
router.put('/users/:id', updateUser);

// DELETE user by ID
router.delete('/users/:id', deleteUser);

module.exports = router;
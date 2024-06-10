const express = require('express');
const router = express.Router();
const Joi = require('joi');
const User = require('../models/user');

const insertUserSchema = Joi.object({
    username: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    hobby: Joi.string().required()
});

const updateUserSchema = Joi.object({
    firstName: Joi.string().optional().allow(''),
    lastName: Joi.string().optional().allow(''),
    hobby: Joi.string().optional().allow('')
});
router.post('/insert', async (req, res) => {
    // Validate the request body
    const { error } = insertUserSchema.validate(req.body);
    if (error) {
        return res.status(400).send('Validation failed');
    }

    const { username, firstName, lastName, hobby } = req.body;

    try {
        // Check if a user with the given username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).send('Username already exists');
        }

        // If username is unique, create a new user
        const newUser = new User({
            username,
            details: {
                firstName,
                lastName,
                hobby,
            },
        });

        await newUser.save();
        res.status(201).send('User inserted successfully');
    } catch (err) {
        res.status(500).send('Error inserting user');
    }
});

// Update User Route
router.put('/update/:username', async (req, res) => {
    const { error } = updateUserSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { username } = req.params;
    const updates = {};
    if (req.body.firstName) updates['details.firstName'] = req.body.firstName;
    if (req.body.lastName) updates['details.lastName'] = req.body.lastName;
    if (req.body.hobby) updates['details.hobby'] = req.body.hobby;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { $set: updates },
            { new: true }
        );

        if (!updatedUser) {
            res.status(404).send('User not found');
        } else {
            res.send('User updated successfully');
        }
    } catch (err) {
        res.status(500).send('Error updating user: ' + err.message);
    }
});

router.delete('/delete/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const deletedUser = await User.findOneAndDelete({ username });

        if (!deletedUser) {
            res.status(404).send('User not found');
        } else {
            res.send('User deleted successfully');
        }
    } catch (err) {
        res.status(500).send('Error deleting user: ' + err.message);
    }
});

router.get('/show/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            res.status(404).send('User not found');
        } else {
            res.json(user);
        }
    } catch (err) {
        res.status(500).send('Error fetching user details: ' + err.message);
    }
});

router.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send('Error fetching users: ' + err.message);
    }
});

module.exports = router;

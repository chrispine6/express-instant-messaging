const express = require('express');
const router = express.Router();
const Message = require('../models/message.model'); 

module.exports = function(io) {
    router.get('/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;
            const messages = await Message.find({ $or: [{ sender: userId }, { recipient: userId }] });
            res.render('chat', { userId, messages });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    router.post('/:userId/send', async (req, res) => {
        try {
            const { userId } = req.params;
            const { content } = req.body;

            const newMessage = new Message({
                sender: userId,
                recipient: userId,
                content: content
            });

            await newMessage.save();
            // broadcast message to all clients
            io.emit('chat message', { userId, message: content });
            res.redirect(`/chat/${userId}`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    return router;
};
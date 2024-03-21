const express = require('express');
const router = express.Router();

router.get('/:userId', (req, res) => {
    const userId = req.params.userId;
    // Implement logic to fetch user details by userId and render the chat interface
    res.render('chat', { userId });
});

module.exports = router;

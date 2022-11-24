const express = require("express");
const router = express.Router();
const Comments = require("../schemas/comment");
const Posts = require("../schemas/post");

router.get("/", async (req, res) => {
    res.send('This is Home Page');
});

router.post("/comments/:postId", async (req, res) => {
    const { postId } = req.params;
    const { user, password, content } = req.body;

    if (!content) {
        return res.status(400).json({ success: false, message: "Please enter your comment" });
    }

    const posts = await Posts.find({
        postId: +postId,
    });

    if (!posts.length) {
        return res.status(400).json({ success: false, message: "Data not found" });
    }

    const newComment = await Comments.create({
        postId : +postId,
        user,
        password,
        content,
    });

    res.json({ comments : newComment });
});

router.get("/comments/:postId", async (req, res) => {

    const { postId } = req.params;

    const comments = await Comments.find({
        postId: +postId,
    });

    if (!comments.length) {
        return res.status(400).json({ success: false, message: "Data not found" });
    }

    res.json({ comments });
});

router.put("/comments/:commentId", async (req, res) => {
    
    // Get id from params
    const { commentId } = req.params;

    // Get data from body

    const { password, content } = req.body;

    // Check if data is empty

    if (!content) {
        return res.status(400).json({ success: false, message: "Please enter your comment" });
    }

    // Find data by id

    const comments = await Comments.find({ commentId: +commentId });

    // Check if data is not found

    if (!comments.length) {
        return res.status(400).json({ success: false, message: "Data not found" });
    }

    // Check if password is correct

    if (comments[0].password !== password) {
        return res.status(400).json({ success: false, message: "Password is incorrect" });
    }

    // Update data

    const updateComment = await Comments.updateOne(
        { commentId: +commentId },
        { $set: { content } }
    );

    res.json({ success: true, message: "Comment updated successfully" });

});

router.delete("/comments/:commentId", async (req, res) => {

    // Get id from params

    const { commentId } = req.params;

    // Get data from body

    const { password } = req.body;

    // Check if data is empty

    if (!password) {
        return res.status(400).json({ success: false, message: "Please enter your password" });
    }

    // Loop data to find data by id

    const comments = await Comments.find ({ commentId: +commentId });

    console.log(comments[0].content);

    // Check if data is not found

    if (!comments.length) {
        return res.status(400).json({ success: false, message: "Data not found" });
    }

    // Check if password is correct

    if (comments[0].password !== password) {
        return res.status(400).json({ success: false, message: "Password is incorrect" });
    }

    // Delete data

    const deleteComment = await Comments.deleteOne ({ commentId: +commentId });

    res.json({ success: true, message: "Comment deleted successfully" });

});


module.exports = router;

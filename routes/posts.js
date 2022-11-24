const express = require("express");
const router = express.Router();
const Posts = require("../schemas/post");

router.get("/", async (req, res) => {
    res.send('This is Home Page');
});

router.get("/posts", async (req, res) => {
    res.json({
        posts: await Posts.find({}),
    });
});

router.post("/posts", async (req, res) => {
    const { postId, user, password, title, content } = req.body;

    const posts = await Posts.find({ postId });

    if (posts.length) {
        return res.status(400).json({ success: false, message: "Post ID already exists" });
    }

    const newPost = await Posts.create({
        postId,
        user,
        password,
        title,
        content,
    });

    res.json({ posts : newPost });
});

router.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;

    const detail = await Posts.find({ postId });

    if (!detail.length) {
        return res.status(400).json({ success: false, message: "Data not found" });
    }

    res.json({ detail });
});


router.put("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    const {title, content } = req.body;
    
    const posts = await Posts.find({ postId: +postId });

    if (!posts.length) {
        return res.status(400).json({ success: false, message: "Data not found" });
    }

    const password = req.body.password;

    if (password !== posts[0].password) {
        return res.status(400).json({ success: false, message: "Wrong password" });
    }

    const updatedPost = await Posts.updateOne(
        { postId: +postId },
        { $set: { title, content } }
    );

    res.json({ result: "Post updated" });

});

router.delete("/posts/:postId", async (req, res) => {
    const { postId } = req.params;

    const posts = await Posts.find({ postId: +postId });

    if (!posts.length) {
        return res.status(400).json({ success: false, message: "Data not found" });
    }

    const password = req.body.password;

    if (password !== posts[0].password) {
        return res.status(400).json({ success: false, message: "Wrong password" });
    }

    await Posts.deleteOne({ postId: +postId });

    res.json({ result: "Post deleted" });

});

module.exports = router;
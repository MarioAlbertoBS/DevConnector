const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


//@route   POST api/posts
//@desc    Create a new post
//access   Private
router.post("/", [auth, [
    check('text', 'Comment text is required').notEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status('400').json({ errors: errors.array() });
    }

    try {
        //Get the user data
        const user = await User.findById(req.user).select('-password');

        //Create the post structure
        const post = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user
        });

        await post.save();

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    GET api/posts
//@desc     Get all posts
//@access   Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({date: -1});
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    GET api/posts/:id
//@desc     Get a specific post by id
//@access   Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status('404').json({ msg: 'Post not found '});
        }

        res.json(post);
    } catch (err) {
        console.error(err.message);

        if (err.kind === 'ObjectId') {
            return res.status('404').json({ msg: 'Post not found '});
        }

        res.status(500).send('Server Error');
    }
});

//@route    POST api/posts/:id
//@desc     Edit a post text
//@access   Private
router.post('/:id', [auth, [
    check('text', 'Comment text is required').notEmpty()
]], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status('404').json({ msg: 'Post not found '});
        }

        //Check the user
        if (post.user.toString() !== req.user) {
            return res.status(401).json({ msg: 'User not authorized '});
        }

        post.text = req.body.text;
        post.save();

        res.json(post);
    } catch (err) {
        console.error(err.message);

        if (err.kind === 'ObjectId') {
            return res.status('404').json({ msg: 'Post not found '});
        }

        res.status(500).send('Server Error');
    }
});

//@route    DELETE api/posts/:id
//@desc     Delete a post
//@access   Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(400).json({ msg: 'Post not found' });
        }

        //Check the user
        if (post.user.toString() !== req.user) {
            return res.status(401).json({ msg: 'User not authorized '});
        }

        await post.remove();

        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status('404').json({ msg: 'Post not found '});
        }

        res.status(500).send('Server Error');
    }
});

//@route    PUT api/posts/like/:id
//@desc     Like a post
//@access   Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(400).json({ msg: 'Post not found' });
        }

        //Check if the user already been liked
        if (post.likes.filter(like => like.user.toString() === req.user).length > 0) {
            //Get remove index
            const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user);
            post.likes.splice(removeIndex, 1);
        } else {
            post.likes.unshift({ user: req.user });
        }

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status('404').json({ msg: 'Post not found '});
        }

        res.status(500).send('Server Error');
    }
});

//@route   POST api/posts/comment/:id
//@desc    Comment a post
//access   Private
router.post("/comment/:id", [auth, [
    check('text', 'Comment text is required').notEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status('400').json({ errors: errors.array() });
    }

    try {
        //Get the user data
        const user = await User.findById(req.user).select('-password');
        //Create the post structure
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status('404').json({ msg: 'Post not found '});
        }

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user
        };

        post.comments.unshift(newComment);

        await post.save();

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status('404').json({ msg: 'Post not found '});
        }
        res.status(500).send('Server Error');
    }
});

//@route   POST api/posts/comment/:id/:comment_id
//@desc    Edit a comment
//access   Private
router.post('/comment/:id/:comment_id', [auth, [
    check('text', 'Comment Text is required')
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
    }

    try {
        //Get the user data
        const user = await User.findById(req.user).select('-password');
        //Create the post structure
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status('404').json({ msg: 'Post not found '});
        }

        //Pull out the comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        if (!comment) {
            return res.status('404').json({ msg: 'Comment not found '});
        }

        //Only the user who comment can delete
        if (comment.user.toString() !== req.user) {
            return res.status('401').json({ msg: 'User not authorized '});
        }

        //Update comment
        comment.text = req.body.text;
        post.save();

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status('404').json({ msg: 'Post or comment not found '});
        }
        res.status(500).send('Server Error');
    }
});

//@route   DELETE api/posts/comment/:id/:comment_id
//@desc    Delete a comment
//access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        //Get the user data
        const user = await User.findById(req.user).select('-password');
        //Create the post structure
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status('404').json({ msg: 'Post not found '});
        }

        //Pull out the comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        if (!comment) {
            return res.status('404').json({ msg: 'Comment not found '});
        }

        //Only the user who comment can delete
        if (comment.user.toString() !== req.user) {
            return res.status('401').json({ msg: 'User not authorized '});
        }

        //Remove comment
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user);
        post.comments.splice(removeIndex, 1);
        post.save();

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status('404').json({ msg: 'Post or comment not found '});
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
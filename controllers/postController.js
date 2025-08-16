// controllers/postController.js
const Post = require("../models/Post");
const Comment = require("../models/Comment"); // Comment model လိုအပ်လို့
const postService = require("../services/postService");
// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  const { text, image } = req.body; // image က optional

  if (!text && !image) {
    return res.status(400).json({ message: "Post must contain text or an image" });
  }

  try {
    const newPost = await Post.create({
      user: req.user._id, // Auth middleware ကနေ ရတဲ့ user ID
      text,
      image, // image upload လုပ်ပြီးရင် ဒီနေရာမှာ Cloudinary URL ထည့်မယ်
    });

    // User ရဲ့ posts array ထဲကိုလည်း Post ID ထည့်နိုင်တယ် (optional, ဒါပေမယ့် ပိုပြီး query မြန်စေ)
    // const user = await User.findById(req.user._id);
    // user.posts.push(newPost._id);
    // await user.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all posts (Timeline)
// @route   GET /api/posts
// @access  Private (or Public, depends on app logic)
// exports.getAllPosts = async (req, res) => {
//   try {
//     // user နဲ့ comments field တွေကို populate လုပ်မယ်
//     const posts = await Post.find()
//       .populate("user", "username profilePicture") // user ရဲ့ username နဲ့ profilePicture ပဲ လိုချင်တယ်
//       .populate({
//         path: "comments",
//         populate: {
//           path: "user", // comment ရဲ့ user ကိုပါ populate လုပ်မယ်
//           select: "username profilePicture",
//         },
//       })
//       .sort({ createdAt: -1 }); // နောက်ဆုံးတင်တဲ့ Post ကို အပေါ်ဆုံးမှာ ပြမယ်

//     res.json(posts);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// @desc    Get all posts with pagination
// @route   GET /api/posts?page=<page>&limit=<limit>
// @access  Private
exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("user", "username profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username profilePicture",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    const hasMore = page * limit < totalPosts;

    res.json({
      posts,
      totalPosts,
      page,
      hasMore,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Private (or Public)
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "username profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username profilePicture",
        },
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error(error.message);
    // CastError (invalid ID) ဆိုရင်လည်း Not Found ဖြစ်သင့်တယ်
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ကိုယ်ပိုင် Post ကိုမှ ဖျက်ခွင့်ပေးမယ်
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this post" });
    }

    // Post နဲ့ ဆက်စပ်နေတဲ့ comments တွေကိုပါ ဖျက်မယ်
    await Comment.deleteMany({ post: req.params.id });

    await Post.deleteOne({ _id: req.params.id }); // Mongoose 6+ မှာ deleteOne or deleteMany
    // await post.remove(); // Mongoose 5.x မှာ

    res.json({ message: "Post removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Like or Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
// exports.likePost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     // User က ဒီ Post ကို Like လုပ်ထားပြီးသားလား စစ်မယ်
//     if (post.likes.includes(req.user._id)) {
//       if (!post) {
//         return res.status(404).json({ message: "Post not found" });
//       }
//       const isLiked = post.likes.includes(req.user._id);
//       if(isLiked){
// post.likes = post.likes.filter((like) => like.toString() !== req.user._id.toString());
//       }else{

//       }
//       // Like လုပ်ထားပြီးသားဆိုရင် Unlike လုပ်မယ် (array ထဲက ID ကို ဖယ်ထုတ်)

//       await post.save();
//       return res.json({ message: "Post unliked", likes: post.likes.length });
//     } else {
//       // Like လုပ်ထားခြင်း မရှိသေးရင် Like လုပ်မယ် (array ထဲကို ID ထည့်)
//       post.likes.push(req.user._id);
//       await post.save();
//       return res.json({ message: "Post liked", likes: post.likes.length });
//     }
//   } catch (error) {
//     console.error(error.message);
//     if (error.kind === "ObjectId") {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.likePost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     const isLiked = post.likes.includes(req.user._id);

//     if (isLiked) {
//       // Unlike လုပ်မယ်
//       post.likes = post.likes.filter((like) => like.toString() !== req.user._id.toString());
//     } else {
//       // Like လုပ်မယ်
//       post.likes.push(req.user._id);
//     }

//     await post.save();

//     // အောင်မြင်ရင် Post Object အပြည့်အစုံကို ပြန်ပေးမယ်
//     res.json(post);
//   } catch (error) {
//     console.error(error.message);
//     if (error.kind === "ObjectId") {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     res.status(500).json({ message: "Server error" });
//   }
// };

// @desc    Like or Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const result = await postService.toggleLike(req.params.id, req.user._id);
    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }
    res.json(result.post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
// exports.addComment = async (req, res) => {
//   const { text } = req.body;

//   if (!text) {
//     return res.status(400).json({ message: "Comment text is required" });
//   }

//   try {
//     const post = await Post.findById(req.params.id);

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     const newComment = await Comment.create({
//       post: req.params.id,
//       user: req.user._id,
//       text,
//     });

//     // Post ရဲ့ comments array ထဲကို Comment ID ထည့်မယ်
//     post.comments.push(newComment._id);
//     await post.save();

//     // Comment ကို return ပြန်တဲ့အခါ user data ပါ ပြန်ပေးဖို့ populate လုပ်မယ်
//     const populatedComment = await Comment.findById(newComment._id).populate("user", "username profilePicture");

//     res.status(201).json(populatedComment);
//   } catch (error) {
//     console.error(error.message);
//     if (error.kind === "ObjectId") {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     res.status(500).json({ message: "Server error" });
//   }
// };

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }
  try {
    const newComment = await postService.addComment(req.params.id, req.user._id, text);
    if (!newComment) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/posts/:post_id/comments/:comment_id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    const comment = await Comment.findById(req.params.comment_id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Comment က ဒီ Post မှာ ပိုင်ဆိုင်တာဟုတ်မဟုတ် စစ်ဆေးမယ်
    if (comment.post.toString() !== req.params.post_id) {
      return res.status(400).json({ message: "Comment does not belong to this post" });
    }

    // Comment ပေးထားတဲ့ user ဒါမှမဟုတ် Post ပိုင်ရှင်မှသာ ဖျက်ခွင့်ရှိတယ်
    if (comment.user.toString() !== req.user._id.toString() && post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this comment" });
    }

    // Post ရဲ့ comments array ထဲက Comment ID ကို ဖယ်ထုတ်မယ်
    post.comments = post.comments.filter((comm) => comm.toString() !== req.params.comment_id.toString());
    await post.save();

    await Comment.deleteOne({ _id: req.params.comment_id }); // Mongoose 6+

    res.json({ message: "Comment removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Post or Comment not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

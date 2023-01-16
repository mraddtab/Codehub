const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Files = require("../models/fileModel");

// @desc    Get login page
// @route   GET /login
// @access  Public
const loginPage = (req, res) => {
  res.json({ message: "Login Page" });
};


// @desc    Get register page
// @route   GET /register
// @access  Public
const registerPage = (req, res) => {
  res.json({ message: "Register User" });
};

// @desc    Get forgot page
// @route   GET /forgot
// @access  Public
const forgotPage = (req, res) => {
  res.json({ message: "Forgot Page" });
};

// @desc    Get reset page
// @route   GET /reset
// @access  Public
const resetPage = (req, res) => {
  res.json({ message: "Reset Page" });
};

// @desc    Get note page
// @route   GET /note
// @access  Private
const notePage = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const notes = await Files.findById(id);
  res.status(200).json(notes);
})

// @desc    Get note page for view page
// @route   GET /note/view/:id
// @access  Private
const notePageView = asyncHandler(async (req, res) => {
  const { ObjectId } = mongoose.Types;
  const id = ObjectId(req.params.id);
  const note = await Files.findById(id);
  res.status(200).json(note);
});

// @desc    Get comments from a note
// @route   GET /comment/:id
// @access  Private
const commentPage = asyncHandler(async (req, res) => {
  const noteId = req.params.id;
  const comments = await Files.findById(noteId);
  res.status(200).json(comments);
});

// @desc    Submit new user
// @route   POST /register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error(`Please add all fields\n${name}\n${email}\n${password}`);
  }
  //Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.json({
      success: false
    })
  }
  else{
    res.json({
      success: true
    })
  }
  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Default token
  const Str = require('@supercharge/strings')
  const token = Str.random(50)

  //Create User
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    token: token,
  });

  const file = await Files.create({
    email,
    filename: "test",
    code: "print(Hello World!)",
  });

  if (user) {
    const token = generateToken(user._id);
    res.status(200).json({success: true, jwt: token});
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


// @desc    Authenticate user
// @route   POST /login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id);
    res.status(200).json({success: true, jwt: token});
  } else {
    res.status(200).json({success: false});
    throw new Error("Invalid credentials");
  }
});

// @desc    Send email token for reset password
// @route   POST /forgot
// @access  Public
const forgottenUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error(`Please add all fields\n${email}`);
  }


  const Str = require('@supercharge/strings')
  const token = Str.random(50)
  const filter = { email: email };
  const update = { token: token };

  const userExists = await User.findOneAndUpdate( filter, update);

  if(userExists){

    let mailOptions = {
      from: "noreply1bees@gmail.com",
      to: email,
      subject: "Reset Token",
      html: "token code:" + token
    }
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }

      res.json({
        success: true
      })
    })
  }
  else {
    res.json({
      success: false
    })
  }
  

})

// @desc    Change password
// @route   POST /reset
// @access  Public
const resetUser = asyncHandler(async (req, res) => {

  const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {

    res.status(400);
    throw new Error(`Please add all fields\n`);
  }


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const filter = { token: token };
  const update = { password: hashedPassword };

  const tokenExists = await User.findOneAndUpdate(filter, update);

  if(!tokenExists){
    throw new Error(`Invalid Code\n`);
  }
  else{
    res.json({
      success: true
    })
  }
  

});

// @desc    Save note
// @route   POST /note/:id
// @access  Private
const noteUser = asyncHandler(async (req, res) => {

  const noteId = req.params.id;
  const { code } = req.body;

  const id = { _id: noteId};
  const update = { code: code };

  const fileExists = await Files.findOneAndUpdate(id, update);
  if(!fileExists){
    throw new Error(`Invalid Code\n`);
  }
  else{
    res.json({
      success: true
    })
  }

});

// @desc    Save comment
// @route   POST /comment/:id
// @route   Private
const commentUser = asyncHandler(async (req, res) => {
  const { commentId, removeComment, comments } = req.body;
  const noteId = req.params.id;
  const filter = { _id: noteId };
  const ObjectId = mongoose.Types.ObjectId;
  const found = await Files.findOne({comments:{$elemMatch:{_id: ObjectId(commentId)}}});
  if(found && !removeComment){
    await Files.updateOne(
      {comments:{$elemMatch:{_id: ObjectId(commentId)}}},
      {$set : {"comments.$.title" : comments[0].title, "comments.$.input" : comments[0].input}
    })
  }
  else if(removeComment){
    await Files.findOneAndUpdate(filter, 
      { $pull: { 
        comments: {
          height : comments[0].height,
          title : comments[0].title,
          input: comments[0].input
          }  
      } 
    })
  }
  else{
    await Files.findOneAndUpdate(filter, 
      { $push: { 
        comments: {
          height : comments[0].height,
          title : comments[0].title,
          input: comments[0].input
          }  
      } 
    })
  }
});

const deleteDocument = asyncHandler(async (req, res) => {
  const { commentId } = req.body;
  const ObjectId = mongoose.Types.ObjectId;
  await Files.findByIdAndDelete({_id: ObjectId(commentId)})
});

// @desc    Gets all notes given user id
// @route   GET /notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Files.find({ user: req.user.id });
  res.status(200).json(notes);
});


// @desc Updates one note given note id
// @route POST /notes/:id
// @access Private
const renameNote = asyncHandler(async (req, res) => {;
  const note = await File.findById(req.params.id);

  if (!note) {
    res.status(400);
    throw new Error("Note not found");
  }

  const { newName } = req.body;
  const id = { _id: req.params.id };
  const filename = { filename : newName};
  const updatedNote = await File.findOneAndUpdate(id, filename);

  res.status(200).json(updatedNote);
});

// @desc    Creates new note
// @route   POST /postNotes
// @access  Private
const postNotes = asyncHandler(async (req, res) => {
  const { filename } = req.body;
  const file = await Files.create({
    user: req.user.id,
    email: req.user.email,
    filename: filename,
    code: "",
  });

  if (file) {
    res.status(200).json(file);
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


module.exports = {
  loginPage,
  registerPage,
  registerUser,
  loginUser,
  forgottenUser,
  forgotPage,
  resetUser,
  resetPage,
  noteUser,
  notePage,
  commentUser,
  commentPage,
  getNotes,
  postNotes,
  renameNote,
  notePageView,
  deleteDocument
};


const nodemailer = require('nodemailer');
const { db } = require("../models/fileModel");
const { default: mongoose } = require("mongoose");

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "noreply.codehub@gmail.com",
    pass: "Codehub$$"
  }
})

let mailOptions = {
  from: "noreply.codehub@gmail.com",
  to: "noreply.codehub@gmail.com",
  subject: "Reset Token",
  html: "token sent"
}

transporter.sendMail(mailOptions, function (err, info) {
  if (err) {
    console.log(err)
  } else {
    console.log(info);
  }
})

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
};
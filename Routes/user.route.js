const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { UserModel } = require("../Model/user.model");
require("dotenv").config();
const nodemailer = require('nodemailer');
const validateRegistrationData = (data) => {
  //here am validating my form data on server side
  const errors = {};
  if (!data.fullName) errors.fullName = "Full Name is required";
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email address is invalid";
  }
  if (!data.phoneNumber) {
    errors.phoneNumber = "Phone Number is required";
  } else if (!/^\d+$/.test(data.phoneNumber)) {
    errors.phoneNumber = "Phone Number is invalid";
  }
  if (!data.eventSession)
    errors.eventSession = "Please select an event session";
  return errors;
};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: process.env.EMAIL,
      pass:  process.env.PASS,
  },
});

userRouter.post("/register", async (req, res) => {
  const errors = validateRegistrationData(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  const token = jwt.sign(req.body, "vivek");
  let data = {
    ...req.body,
  }
  try { 
    const newUser = new UserModel(data);
    await newUser.save();
  

    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: 'Event Registration Confirmation',
      text: `Hello ${req.body.fullName},\n\nYou have successfully registered for the event session: ${req.body.eventSession}. \n\n${token} \n\nThank you!`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error sending email:', error);
        // Handle error
    res.status(500).send({ error: "Failed to register", err:error.message });
    return  
    } else {
        console.log('Email sent: ' + info.response);
        // Handle success
    }
});
    res
      .status(200)
      .send({
        message: "Registration successful and email sent",
        data: req.body,
        token: token.substr(15, 30),
      });
  } catch (error) {
    res.status(500).send({ error: "Failed to register", err:error.message });
  }
});

userRouter.get("/" , async(req, res) => {
  try {
    let userData = await UserModel.find()
    res.status(200).send(userData)
  } catch (error) {
    res.send({error:error.message})
  }
})
module.exports = { userRouter };

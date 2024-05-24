const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = 8080;
app.use(cors())
app.use(express.json());

const validateRegistrationData = (data) => {
    //here am validating my form data on server side
  const errors = {};
  if (!data.fullName) errors.fullName = 'Full Name is required';
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Email address is invalid';
  }
  if (!data.phoneNumber) {
    errors.phoneNumber = 'Phone Number is required';
  } else if (!/^\d+$/.test(data.phoneNumber)) {
    errors.phoneNumber = 'Phone Number is invalid';
  }
  if (!data.eventSession) errors.eventSession = 'Please select an event session';
  return errors;
};

app.post('/register', (req, res) => {
  const errors = validateRegistrationData(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  const token = jwt.sign(req.body, 'vivek');
  // Here you would typically store the data in the database but am just sending the body to response directly
  res.status(200).json({ message: 'Registration successful', data: req.body , token:token.substr(15, 30)});
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

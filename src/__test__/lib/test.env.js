process.env.NODE_ENV = 'development';
process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.Z_COOL_SECRET = 'HynUc0hndJu1i0FjnUM9976KLMXHCffSXDYST9BYGhfIFjFvSJxeMXfRbyblMQpfStx5gXZew3r2YX1kmCay2NNpR2mM4ujzsZoq';

// set this to true or false depending on if you want to hit the mock AWS-SDK
// set to false if you want to make a real API call to your bucket

const isAwsMock = true;

if (isAwsMock) {
  process.env.AWS_BUCKET = 'fake';
  process.env.AWS_SECRET_ACCESS_KEY = 'fakedinosaurdinosaurdinosaur';
  process.env.AWS_ACCESS_KEY_ID = 'fakedinosaur';
  require('./setup');
} else {
  // remember to set your .evn vars and add .env in .gitignore
  require('dotenv').config();
}

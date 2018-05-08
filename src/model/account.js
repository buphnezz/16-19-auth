'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; // Zachary - used to generate hash
import crypto from 'crypto'; // Zachary - used to generate random data
import jsonWebToken from 'jsonwebtoken';

// Zachary - CAPS naming conventions apply to strings and numbers
const HASH_ROUNDS = 8;
const TOKEN_SEED_LENGTH = 128;

const accountSchema = mongoose.Schema({
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
});

function pCreateToken() {
  // Zachary - `this` is equal to the account object we are working with.
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save()
    .then((account) => {
      // Zachary - at this point, we have a token seed.
      // Zachary - sign === encrypt
      return jsonWebToken.sign(// Zachary this line returns a promise that resolves to token)
        { tokenSeed: account.tokenSeed },
        process.env.Z_COOL_SECRET,
      ); // Zachary - When this promise resolves, I have a token
    });
  // Zachary - TODO: error management
}

accountSchema.methods.pCreateToken = pCreateToken;

const Account = mongoose.model('account', accountSchema);

/* Hash variable: 
  - SALT
  - Hashing algorithm (bcrypt)
  - password
  - rounds
*/
Account.create = (username, email, password) => {
  return bcrypt.hash(password, HASH_ROUNDS)
    .then((passwordHash) => {
      // Zachary - we have the password hash
      password = null; // eslint-disable-line
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex'); // Zachary - hex is used due to HTTP
      return new Account({
        username,
        email,
        passwordHash,
        tokenSeed,
      }).save();
    });
};

export default Account;

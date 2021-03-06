'use strict';

import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jsonWebToken from 'jsonwebtoken';
import HttpError from 'http-errors';

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
  username: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  created: {
    type: Date,
    default: () => new Date(),
  },
});

const TOKEN_SEED_SIZE = 128;
const HASH_SALT_ROUNDS = 8;

function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash)
    .then((result) => {
      if (!result) {
        throw new HttpError(401, '__AUTH__ incorrect username or password');
      }
      return this;
    });
}

function createToken() {
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_SIZE).toString('hex');

  return this.save()
    .then((account) => {
      // Zachary - here, we know that the tokenSeed is unique
      return jsonWebToken.sign(
        { tokenSeed: account.tokenSeed },
        process.env.Z_COOL_SECRET,
      );
    });
}

accountSchema.methods.verifyPassword = verifyPassword;
accountSchema.methods.createToken = createToken;

const Account = module.exports = mongoose.model('account', accountSchema);

Account.pCreate = (username, email, password) => {
  // Zachary - TODO : validation checks
  return bcrypt.hash(password, HASH_SALT_ROUNDS)
    .then((passwordHash) => {
      // Zachary - creating a token seed
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_SIZE).toString('hex');
      return new Account({
        username, // Zachary - same as username : username,
        email,
        passwordHash,
        tokenSeed,
      }).save();
    });
  // Zachary - password is GONE!
};

export default mongoose.model('account', accountSchema);

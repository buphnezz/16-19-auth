'use strict';

import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
  nameFirst: { type: String },
  nameLast: { type: String },
  biography: { type: String },
  pic: { type: String },
  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
});

export default mongoose.model('profile', profileSchema);

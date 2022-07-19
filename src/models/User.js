const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 64,
  },
  title: { type: String, enum: ["Mr.", "Mrs.", "Miss"] },
  city: { type: String },
  country: { type: String },
  about: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  bio: { type: String },
  location: { type: String },
  image: {
    public_id: "",
    url: "",
  },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  visitors: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

//runs before saving user to DB
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

//PW compares between input PW and DB PW
userSchema.methods.comparePassword = function (canditatePassword) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(canditatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }

      resolve(true);
    });
  });
};

mongoose.model("User", userSchema);

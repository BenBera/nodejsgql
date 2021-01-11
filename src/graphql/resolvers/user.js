import { User } from "../../models";
import Joi from "@hapi/joi";
import bcrypt from "bcryptjs";
import { regesterValidate, loginValidate } from "../validators";
import { issueTokens, checkSignedIn } from "../../functions/auth";
export default {
  Query: {
    users: () => {},
    //Login resolver
    login: async (root, args, { req }, info) => {
      await loginValidate.valid(args, { abortEarly: false });
      //check if the user exists in the database or not
      let user = await User.findOne({ username: args.username });
      if (!user) {
        throw new Error("User not Found");
      }
      //Compare Passwords
      let isMatch = await bcrypt.compare(args.password, user.password);
      if (!isMatch) {
        throw new Error("Invalid password");
      }
      //Issue the token and refresh token
      let tokens = await issueTokens(user);
      return {
        user,
        ...tokens,
      };
    },
    //Protected Resolver
    profile: async (root, args, { req }, info) => {
      let authUser = await checkSignedIn(req, true);
      return authUser;
    },
    refreshToken: () => {},
  },
  Mutation: {
    //Fregister resolver
    register: async (root, args, { req }, info) => {
      console.log(args);
      //Validate user data
      await Joi.valid(args, regesterValidate, { abortEarly: true });
      // await regesterValidate.validate(args,{ abortEarly: true} )
      //Cheack if the user is already in the database with the same username
      let user = await User.findOne({ username: args.username });
      if (user) {
        throw new Error("Username already taken");
      }
      user = await User.findOne({ email: args.email });
      if (user) {
        throw new Error("Email already registered");
      }
      //If all passed now  hash the password and create the new user
      args.password = await bcrypt.hash(args.password, 10);
      console.log(args.password);
      let newUser = await User.create(args);

      // issue the token and refreshToken
      let tokens = await issueTokens(newUser);

      return {
        user: newUser,
        ...tokens,
      };
    },
  },
};

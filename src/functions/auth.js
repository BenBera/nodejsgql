import { APP_SECRET, APP_REFRESH_SECRET } from "../config/index.js";
import {AuthenticationError} from 'apollo-server-express'
import { User } from "../models";
import jwt from "jsonwebtoken";


export const issueTokens = async ({ username, email, name, id }) => {
  try {
    let token = await jwt.sign({ username, email, name, id }, APP_SECRET, {
      expiresIn: 120,
    });

    let refreshToken = await jwt.sign(
      { username, email, name, id },
      APP_REFRESH_SECRET,
      { expiresIn: "2d" }
    );
    return {
      token,
      refreshToken,
    };
  } catch (err) {
    console.log(err);
  }
};

export const checkSignedIn = async (req, requiresAuth = false) => {
  const header = (await req.headers.authorization) || " no token";
  if (header) {
    const token = jwt.verify(header, APP_SECRET);
    console.log("TOKEN_DECODED", token);
    const authUser = await User.findById(token.id)
    if(!authUser){
      throw new AuthenticationError("Invalid tooken , Authentication Failed")
    }
    if(requiresAuth){
      return authUser;
    }
  return null;
  }
};

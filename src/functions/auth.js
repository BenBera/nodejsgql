import { APP_SECRET, APP_REFRESH_SECRET } from "../config/index.js";
import jwt from "jsonwebtoken";

export const issueTokens = async ({ username, email, name }) => {
  try {
    let token = await jwt.sign({ username, email, name }, APP_SECRET, {
      expiresIn: 120,
    });

    let refreshToken = await jwt.sign(
      { username, email, name },
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

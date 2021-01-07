import jwt from "jsonwebtoken";
import { APP_SECRET, APP_REFRESH_SECRET } from "../config";
export const issueTokens = async ({ username, email, name, id }) => {
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
      refreshToken
  }
};

import { sign } from "jsonwebtoken";

export const issueToken = (user) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN, {
    expiresIn: "1h",
  });
};

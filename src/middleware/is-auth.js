import { verify } from "jsonwebtoken";
import User from "../models/User";

const AuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("TOKEN", authHeader);

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  let decodedToken;
  try {
    decodedToken = verify(token, process.env.ACCESS_TOKEN);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  // console.log("decoded Token", decodedToken)
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  let authUser = await User.findById(decodedToken.userId);
  if (!authUser) {
    console.log('test here')
    req.isAuth = false;
    return next();
  }

  req.userId = authUser.userId;
  req.isAuth = true;
  return next();
};

export default AuthMiddleware;

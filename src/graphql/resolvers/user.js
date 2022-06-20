import User from "../../models/User";
import { ApolloError } from "apollo-server-express";
import { issueToken } from "../../helpers/setToken";
import { hash, compare } from "bcryptjs";

export default {
  Query: {
    fetchUsers: async () => await User.find(),
    fetchUserById: async (_, { id }) => await User.findById(id).populate('createdProject'),
  },

  Mutation: {
    createUser: async (
      _,
      { userInput: { firstname, lastname, dob, email, password, role } }
    ) => {
      try {
        // check existing user
        const oldUser = await User.findOne({ email });

        // throw error if user exist
        if (oldUser) {
          throw new ApolloError(
            email + " is already registered.",
            "USER_ALREADY_EXISTS"
          );
        }

        var encryptedPassword = await hash(password, 12);

        const newUser = new User({
          firstname: firstname,
          lastname: lastname,
          dob: dob,
          email: email.toLowerCase(),
          password: encryptedPassword,
          role: role,
        });

        await newUser.save();

        return {
          accessToken: issueToken(newUser),
        };
      } catch (err) {
        throw new ApolloError(err.message, 400);
      }
    },
    login: async (_, { loginInput: { email, password } }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new ApolloError(
          `Cannot find user with email: ${email}`,
          "INVALID_USER"
        );
      }

      if (user && (await compare(password, user.password))) {
        return {
          accessToken: issueToken(user),
        };
      }
      {
        throw new ApolloError("Incorrect password", "INCORRECT_PASSWORD");
      }
    },
    updateUser: async (
      _,
      {
        id,
        updateInput: { firstname, lastname, dob, email, password, imgUrl },
      },
      req
    ) => {
      if (!req.isAuth) {
        throw new ApolloError("you must be authenticated for this action.");
      }
      const updateData = {};

      if (firstname !== undefined) updateData.firstname = firstname;
      if (lastname !== undefined) updateData.lastname = lastname;
      if (dob !== undefined) updateData.dob = dob;
      if (email !== undefined) updateData.email = email;
      if (password !== undefined) updateData.password = password;
      if (imgUrl !== undefined) updateData.imgUrl = imgUrl;

      const user = await User.findByIdAndUpdate(
        id,
        {
          firstname,
          lastname,
          dob,
          email,
          password,
          imgUrl,
        },
        { new: true }
      );
      return user;
    },
    deleteUser: async (_, { id }, req) => {
      if (!req.isAuth) {
        throw new ApolloError("you must be authenticated for this action.");
      }

      await User.findByIdAndDelete(id);
      return "User has been deleted.";
    },
  },
};

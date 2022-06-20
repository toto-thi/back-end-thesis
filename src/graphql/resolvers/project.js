import Project from "../../models/Project";
import User from "../../models/User";
import { ApolloError } from "apollo-server-express";

export default {
  Query: {
    getAllProjects: async () => await Project.find(),
    getProjectById: async (_, { id }) => await Project.findById(id),
  },
  Mutation: {
    addProject: async (
      _,
      {
        projectInput: {
          title,
          description,
          imageList,
          startDate,
          endDate,
          targetAmount,
        },
      },
      req
    ) => {
      if (!req.isAuth) {
        throw new ApolloError("You must be authenticated for this action.");
      }
      try {
        const checkTitle = await Project.findOne({ title });

        if (checkTitle) {
          throw new Error("This project is already existed");
        }

        const newProject = new Project({
          title,
          description,
          imageList,
          startDate,
          endDate,
          targetAmount,
          createdBy: req.userId,
        });

        await newProject.save();

        const creator = await User.findById(req.userId);
        creator.createdProject.push(newProject);
        await creator.save();

        return {
          ...newProject._doc,
          // createdBy:  newProject.createdBy
        };
      } catch (err) {
        throw new ApolloError(err.message, 400);
      }
    },
    updateProject: async (
      _,
      {
        id,
        projectInput: {
          title,
          description,
          imageList,
          startDate,
          endDate,
          targetAmount,
        },
      },
      req
    ) => {
      if (!req.isAuth) {
        throw new ApolloError("You must be authenticated for this action.");
      }

      try {
        const updateData = {};

        if (!title === undefined) updateData.title = title;
        if (!description === undefined) updateData.description = description;
        if (!imageList === undefined) updateData.imageList = imageList;
        if (!startDate === undefined) updateData.startDate = startDate;
        if (!endDate === undefined) updateData.endDate = endDate;
        if (!targetAmount === undefined) updateData.targetAmount = targetAmount;

        const project = await Project.findByIdAndUpdate(
          id,
          {
            title,
            description,
            imageList,
            startDate,
            endDate,
            targetAmount,
          },
          { new: true }
        );

        await project.save();
        return project;
      } catch (err) {
        throw new ApolloError(err.message, 400);
      }
    },
    deleteProject: async (_, { id }, req) => {
      if (!req.isAuth) {
        throw new ApolloError("You must be authenticated for this action.");
      }

      try {
        const owner = await Project.findOne({ id });

        // remove ref Id from creator
        await User.updateOne(
          {
            _id: owner.createdBy,
          },
          {
            $pull: { createdProject: id },
          }
        );

        //will consider use update status insteand of this later
        await Project.deleteOne({ _id: id });

        return "Project has been deleted.";
      } catch (err) {
        throw new ApolloError(err.message, 400);
      }
    },
  },
};
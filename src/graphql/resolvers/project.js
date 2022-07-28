import Project from "../../models/Project";
import User from "../../models/User";
import { ApolloError } from "apollo-server-express";

export default {
  Query: {
    getAllProjects: async () => await Project.find().populate("createdBy"),
    getProjectById: async (_, { id }) =>
      await Project.findById(id).populate("createdBy"),
    getPendingProjects: async () =>
      await Project.find({ isPending: true }).populate("createdBy"),
    getApprovedProjects: async () =>
      await Project.find({ isApproved: true }).populate("createdBy"),
    getRejectedProjects: async () =>
      await Project.find({ isRejected: true }).populate("createdBy"),
    getClosedProjects: async () =>
      await Project.find({ isClosed: true }).populate("createdBy"),
    getProjectByCreator: async (_, { uid }) =>
      await Project.find({ createdBy: uid }).populate("createdBy"),
    calTotalDonation: async () => {
      const result = await Project.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$donateAmount",
            },
          },
        },
      ]);

      return parseFloat(result[0].total);
    },
  },
  Mutation: {
    addProject: async (
      _,
      {
        projectInput: {
          title,
          description,
          location,
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
        const newProject = new Project({
          title,
          description,
          location,
          imageList,
          startDate,
          endDate,
          targetAmount,
          createdBy: req.userId.toString(),
        });

        let result = await newProject.save();
        await result.populate("createdBy");

        const creator = await User.findById(req.userId);
        creator.createdProject.push(newProject);
        await creator.save();

        return result;
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
          location,
          imageList,
          startDate,
          endDate,
          targetAmount,
          donateAmount,
          updatedAt,
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
        if (!location === undefined) updateData.location = location;
        if (!imageList === undefined) updateData.imageList = imageList;
        if (!startDate === undefined) updateData.startDate = startDate;
        if (!endDate === undefined) updateData.endDate = endDate;
        if (!targetAmount === undefined) updateData.targetAmount = targetAmount;
        if (!donateAmount === undefined) updateData.donateAmount = donateAmount;

        const project = await Project.findByIdAndUpdate(
          id,
          {
            title,
            description,
            location,
            imageList,
            startDate,
            endDate,
            targetAmount,
            donateAmount,
            updatedAt: new Date(updatedAt),
          },
          { new: true }
        );

        await project.save();
        return project.populate("createdBy");
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

        //will consider use update status instead of this later
        await Project.deleteOne({ _id: id });

        return "Project has been deleted.";
      } catch (err) {
        throw new ApolloError(err.message, 400);
      }
    },
    approveProject: async (_, { id, approval, contractAddress }, req) => {
      if (!req.isAuth) {
        throw new ApolloError("You must be authenticated for this action.");
      }

      let cAddress = {};

      if (!contractAddress === undefined && contractAddress === "")
        cAddress.contractAddress = contractAddress;

      try {
        const res = await Project.findByIdAndUpdate(
          id,
          {
            isPending: false,
            isApproved: approval,
            contractAddress: contractAddress,
          },
          {
            new: true,
          }
        );

        await res.save();
        return true;
      } catch (err) {
        throw new ApolloError(err.message, 400);
      }
    },
    rejectProject: async (_, { id, rejection }, req) => {
      if (!req.isAuth) {
        throw new ApolloError("You must be authenticated for this action.");
      }

      try {
        const res = await Project.findByIdAndUpdate(
          id,
          {
            isPending: false,
            isRejected: rejection,
          },
          { new: true }
        );

        await res.save();
        return true;
      } catch (err) {
        throw new ApolloError(err.message, 400);
      }
    },
  },
};

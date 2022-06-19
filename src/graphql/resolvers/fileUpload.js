import { join, parse } from "path";
import { createWriteStream } from "fs";
import GraphqlUpload  from 'graphql-upload/GraphQLUpload'

export default {
  Upload: GraphqlUpload,
  Mutation: {
    fileUploader: async (_, { file }) => {
      let { filename, createReadStream } = await file;

      let stream = createReadStream();

      let { name, ext } = parse(filename);

      name = name.replace(/([^a-z0-9 ]+)/gi, "-").replace(" ", "_");

      let storeFile = join(
        __dirname,
        `../../uploads/${name}-${Date.now()}${ext}`
      );

      console.log("path: ", storeFile);
      let writeStream = createWriteStream(storeFile);
      await stream.pipe(writeStream);

      storeFile = `${process.env.BASE_UPLOAD_URL}${storeFile.split("uploads")[1]}`;

      return storeFile;
    },
  },
};

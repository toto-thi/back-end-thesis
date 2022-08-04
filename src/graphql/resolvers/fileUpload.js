import { join, parse } from "path";
import { createWriteStream } from "fs";
import GraphqlUpload from "graphql-upload/GraphQLUpload";

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

      let writeStream = createWriteStream(storeFile);
      await stream.pipe(writeStream);

      storeFile = `${process.env.BASE_UPLOAD_URL}${
        storeFile.split("uploads")[1]
      }`;

      return storeFile;
    },
    multipleFileUploader: async (_, { files }) => {
      let url = [];

      for (let i = 0; i < files.length; i++) {
        const { createReadStream, filename } = await files[i];

        let { name, ext } = parse(filename);
        const assetUniqName = name
          .replace(/([^a-z0-9 ]+)/gi, "-")
          .replace(" ", "_");

        const pathName = join(
          __dirname,
          `../../uploads/${assetUniqName}-${Date.now()}${ext}`
        );

        const stream = createReadStream();

        await stream.pipe(createWriteStream(pathName));

        const urlForArray = `${process.env.BASE_UPLOAD_URL}${
          pathName.split("uploads")[1]
        }`;

        url.push({ url: urlForArray });
      }

      return url;
    },
  },
};

import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";
import { Buffer } from "buffer";
type FileOption = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

const storage = new Storage({
  keyFilename: process.env["GCS_KEY_FILE_NAME"],
});
const bucket = storage.bucket(process.env["GCS_BUCKET_NAME"]);

export const uploadFileToGoogleCloud = (file: FileOption) => {
  if (!file) {
    return;
  }

  const { originalname, mimetype, buffer } = file;
  const blob = bucket.file(originalname);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: mimetype,
    },
  });
  blobStream.on("error", (err) => {
    console.log({ err: err });
    return;
  });
  blobStream.end(buffer);
};

export const getPublicUrlForFile = async (
  fileName: string
): Promise<string> => {
  const options: GetSignedUrlConfig = {
    version: "v4",
    action: "read",
    expires: Date.now() + 1000 * 60 * 24 * 5,
  };
  try {
    const [url] = await bucket.file(fileName).getSignedUrl(options);
    return url;
  } catch (error) {
    console.log({ err: error.message });
  }
};

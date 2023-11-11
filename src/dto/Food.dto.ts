export type FileOption = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export interface CreateFoodInput {
  name: string;
  desc: string;
  images: FileOption | null;
  foodType: string;
  readyTime: string;
  price: string;
}

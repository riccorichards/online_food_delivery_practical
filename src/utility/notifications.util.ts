import dotenv from "dotenv";
dotenv.config();

export const generateOtp = () => {
  const otp = Math.floor(Math.random() * 900000 + 100000);
  const expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const requestOTP = async (otp: number, toPhoneNumber: string) => {
  const accountSid = process.env["TWILIO_ACCESS_SID"];
  const authToken = process.env["TWILIO_AUTH_TOKEN"];
  const client = require("twilio")(accountSid, authToken);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: "+12513330910",
    to: `+995${toPhoneNumber}`,
  });

  return response;
};

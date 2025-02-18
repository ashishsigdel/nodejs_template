import EnvType from "../enums/EnvType";

export const getDateAfterMinutes = (minutes: number) => {
  return new Date(Date.now() + minutes * 60000); // convert minutes to milliseconds
};

export const getDateBeforeMinutes = (minutes: number) => {
  return new Date(Date.now() - minutes * 60000); // convert minutes to milliseconds
};

export const generateOTP = (length: number) => {
  if (process.env.NODE_ENV !== EnvType.PROD) {
    return "123456";
  }

  const digits = "0123456789";
  let OTP = "";

  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  return OTP;
};

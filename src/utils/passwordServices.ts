import bcrypt from "bcryptjs";
import PasswordValidator from "password-validator";

const saltRounds = 10;

export const hashPassword = async (password: string) => {
  if (!password) return null;

  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

export const comparePassword = async (
  password: string,
  encryptedPassword: string
) => {
  if (!password || !encryptedPassword) return false;

  return await bcrypt.compare(password, encryptedPassword);
};

export const validatePassword = (password: string) => {
  if (!password) return false;

  const schema = new PasswordValidator();

  schema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits() // Must have digits
    .has()
    .not()
    .spaces(); // Should not have spaces

  return schema.validate(password);
};

// types.d.ts
import { User } from "./models/user.model"; // Adjust path to your User model

declare global {
  namespace Express {
    interface Request {
      user?: InstanceType<typeof User>;
    }
  }
}

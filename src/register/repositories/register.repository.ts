import { User } from "../models/user.schema";

const UserRepository = {
  create: async (newUser: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const user = new User(newUser);
      await user.save();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  findByEmail: async (email: string) => {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  },
};

export default UserRepository;

import { User } from "../types/user.type";

export const getUserFromLocalStorage = (): User | null => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  return user;
};

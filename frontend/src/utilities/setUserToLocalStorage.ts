import { User } from "../types/user.type";

export const setUserToLocalStorage = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
};

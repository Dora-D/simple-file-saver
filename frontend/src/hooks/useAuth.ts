import { useCallback, useEffect, useState } from "react";

import { CredentialResponse } from "@react-oauth/google";

import { useNavigate } from "react-router-dom";

import { setCurrentUser } from "../redux/store/slices/userSlice";
import { useAppDispatch } from "./reduxAppHooks";

import { deleteUserFromLocalStorage } from "../utilities/deleteUserFromLocalStorage";
import { setUserToLocalStorage } from "../utilities/setUserToLocalStorage";
import { getUserFromLocalStorage } from "../utilities/getUserFromLocalStorage";
import axiosInstance from "../utilities/axiosInstance";

import { User } from "../types/user.type";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!getUserFromLocalStorage()
  );

  const navigateToMainPage = useCallback(() => {
    navigate("/drive", { replace: true });
  }, [navigate]);

  const logout = () => {
    setIsAuthenticated(false);
    deleteUserFromLocalStorage();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (isAuthenticated) {
      const user = getUserFromLocalStorage();
      dispatch(setCurrentUser(user));
      navigateToMainPage();
    } else {
      dispatch(setCurrentUser(null));
    }
  }, [isAuthenticated, dispatch, navigateToMainPage]);

  const login = async (credentialResponse: CredentialResponse) => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/auth/google/login`;
      const { data } = await axiosInstance.post<User>(
        url,
        {
          token: credentialResponse.credential,
        },
        {
          withCredentials: true,
        }
      );
      if (data) {
        setUserToLocalStorage(data);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return {
    isAuthenticated,
    logout,
    login,
    navigateToMainPage,
  };
};

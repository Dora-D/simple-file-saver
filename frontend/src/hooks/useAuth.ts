import { useCallback, useEffect, useLayoutEffect } from "react";

import { CredentialResponse } from "@react-oauth/google";

import { useNavigate } from "react-router-dom";

import { setCurrentUser } from "../redux/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "./reduxAppHooks";

import { deleteUserFromLocalStorage } from "../utilities/deleteUserFromLocalStorage";
import { setUserToLocalStorage } from "../utilities/setUserToLocalStorage";
import { getUserFromLocalStorage } from "../utilities/getUserFromLocalStorage";
import axiosInstance from "../utilities/axiosInstance";

import { User } from "../types/user.type";
import { setAuthenticated } from "../redux/store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(({ auth }) => auth.isAuthenticated);

  const setIsAuthenticated = (value: boolean) => {
    dispatch(setAuthenticated(value));
  };

  const navigateToMainPage = useCallback(() => {
    navigate("/drive", { replace: true });
  }, [navigate]);

  const logout = () => {
    dispatch(setCurrentUser(null));

    setIsAuthenticated(false);
    deleteUserFromLocalStorage();
    navigate("/", { replace: true });
  };

  useLayoutEffect(() => {
    if (isAuthenticated) {
      const user = getUserFromLocalStorage();
      dispatch(setCurrentUser(user));
      navigateToMainPage();
    }
  }, [isAuthenticated, dispatch, navigateToMainPage]);

  const login = async (credentialResponse: CredentialResponse) => {
    try {
      const { data } = await axiosInstance.post<User>(
        "/auth/google/login",
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
    logout,
    login,
    navigateToMainPage,
  };
};

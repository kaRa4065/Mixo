import { message } from "antd";
import { ApiError } from "./axiosInstance";

export const handleApiError = (err: unknown) => {
  const error = err as ApiError;

  message.error(error.message || "Something went wrong", 3);
};

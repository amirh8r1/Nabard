import React, { useEffect } from "react";
import "./toast.css";

interface ToastProps {
  type?: "success" | "error";
  message: string;
  onClose: () => void;
  duration?: number; // ثانیه
}

const Toast: React.FC<ToastProps> = ({
  type = "success",
  message,
  onClose,
  duration = 3,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), duration * 1000);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return <div className={`custom-toast ${type}`}>{message}</div>;
};

export default Toast;

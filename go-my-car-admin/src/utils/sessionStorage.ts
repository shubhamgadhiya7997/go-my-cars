import CryptoJS from "crypto-js";
import { SESSION_STORAGE_AUTH_TOKEN_KEY } from "./constants";

const SECRET_KEY = "mySuperSecretKey123"; // Keep this constant, ideally from env variables

// 🔒 Encrypt token before storing
const encryptToken = (token: string) => {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

// 🔓 Decrypt token before using
const decryptToken = (encryptedToken: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Invalid token decryption", error);
    return null;
  }
};

// ✅ Store token securely
export const setToken = (token: string) => {
  const encryptedToken = encryptToken(token);
  sessionStorage.setItem(SESSION_STORAGE_AUTH_TOKEN_KEY, encryptedToken);
};

// ✅ Retrieve token securely
export const getToken = () => {
  const encryptedToken = sessionStorage.getItem("authToken");
  return encryptedToken ? decryptToken(encryptedToken) : null;
};

export const removeToken = () => {
  return sessionStorage.removeItem(SESSION_STORAGE_AUTH_TOKEN_KEY);
};

// Check if a key exists in localStorage
export const hasToken = (): boolean => {
  return sessionStorage.getItem(SESSION_STORAGE_AUTH_TOKEN_KEY) !== null;
};

// Clear all localStorage data
export const clearSessionStorage = () => {
  sessionStorage.clear();
};

// Store an object as JSON in localStorage
export const setSessionStorageObject = (key: string, value: object) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

// Retrieve an object from localStorage
export const getSessionStorageObject = (key: string) => {
  const value = sessionStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const setSessionStorageItem = (key: string, value: any) => {
  sessionStorage.setItem(key, value);
};

export const getSessionStorageItem = (key: string) => {
  const value = sessionStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

// Get all keys stored in localStorage
export const getAllSessionStorageKeys = (): string[] => {
  return Object.keys(sessionStorage);
};
// 🚨 Detect unauthorized token changes
// window.addEventListener("storage", (event) => {
//   if (event.key === "authToken") {
//     const storedToken = getToken();
//     const newToken = decryptToken(event.newValue);

//     if (storedToken && storedToken !== newToken) {
//       console.warn("Token was modified externally! Logging out...");
//       sessionStorage.removeItem("authToken");
//       window.location.reload(); // Logout user
//     }
//   }
// });

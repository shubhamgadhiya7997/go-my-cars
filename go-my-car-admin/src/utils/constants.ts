export const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;

export const SESSION_STORAGE_AUTH_TOKEN_KEY = 'authToken';

export const ACCOUNT_STATUS = {
  DELETED: 0,
  ACTIVE: true,
  DEACTIVATED: false,
} as const;


export const CAR_GEAR = {
  MANUAL: 'manual', 
  AUTO: 'auto', 
};
export const CAR_TYPE = {
  PETROL: 'petrol', 
  DIESEL: 'diesel', 
};


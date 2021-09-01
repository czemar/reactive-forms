export interface ValidationErrors {
  [key: string]: {
    value?: any;
    message: string;
  };
}

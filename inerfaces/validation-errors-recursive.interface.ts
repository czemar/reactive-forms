import { ReactiveAbstract } from '../types/reactive-abstract.type';

export interface ValidationErrorsWithControl {
  [key: string]: {
    control: ReactiveAbstract;
    value?: any;
    message: string;
  };
}

import { FormGroup } from '@angular/forms';
import { ValidationErrors } from '../interfaces/validation-error.interface';
import { ServerError } from '../interfaces/server-error.interface';
import { ReactiveAbstract } from '../types/reactive-abstract.type';
import { List } from './list.class';
import { ValidationErrorsWithControl } from '../interfaces/validation-errors-recursive.interface';
export declare class ReactiveGroup<T = any> extends FormGroup {
    value: T | null;
    errors: ValidationErrors | null;
    private _serverError;
    private _submitted;
    /**
     * returns list of errors based on errors property
     */
    get errorsList(): List<ValidationErrors>;
    /**
     * Returns true if the formGroup was previously submitted
     */
    get submitted(): boolean;
    /**
     * Returns errors from server after submitting formGroup
     */
    get serverError(): ServerError | null;
    /**
     * Submits formGroup (validating all the fields and submitting them)
     * @returns promise with resolve(value) or reject(validationErrors)
     */
    submit(onSuccess?: (value: T | null) => void, onFailure?: (errors: ValidationErrors | null) => void): Promise<T | null>;
    setErrors(errors: ValidationErrors): void;
    setServerError(message: string): void;
    removeServerError(): void;
    /**
     * Returns full list of errors in form
     */
    getErrorsRecursively(): ValidationErrorsWithControl | null;
    getErrorsListRecursively(): List<ValidationErrorsWithControl> | null;
    get<T = (ReactiveAbstract | null)>(path: string | (string | number)[]): T;
    reset(): void;
}

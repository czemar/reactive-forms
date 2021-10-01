import { FormGroup } from '@angular/forms';
import { ValidationErrors } from '../interfaces/validation-error.interface';
import { ReactiveControl } from './reactive-control.class';
import { ServerError } from '../interfaces/server-error.interface';
import { ReactiveAbstract } from '../types/reactive-abstract.type';
import { List } from './list.class';
import { ReactiveArray } from './reactive-array.class';
import { ValidationErrorsWithControl } from '../interfaces/validation-errors-recursive.interface';

export class ReactiveGroup<T = any> extends FormGroup {

  public value!: T | null;
  public errors!: ValidationErrors | null;
  public controls!: { [key: string]: ReactiveAbstract; };

  private _serverError: ServerError | null = null;
  private _submitted = false;

  /**
   * returns list of errors based on errors property
   */
  public get errorsList() {
    return List.fromObject<ValidationErrors>(this.errors);
  }

  /**
   * Returns true if the formGroup was previously submitted
   */
  public get submitted(): boolean {
    return this._submitted;
  }

  /**
   * Returns errors from server after submitting formGroup
   */
  public get serverError(): ServerError | null {
    return this._serverError;
  }

  /**
   * Submits formGroup (validating all the fields and submitting them)
   * @returns promise with resolve(value) or reject(validationErrors)
   */
  public submit(onSuccess?: (value: T | null) => void, onFailure?: (errors: ValidationErrors | null) => void): Promise<T | null> {
    this._submitted = true;
    for (const key of Object.keys(this.controls)) {
      if (this.controls[key] instanceof ReactiveControl) {
        (this.controls[key] as ReactiveAbstract).submit();
      }
    }

    this.markAllAsTouched();

    if (this.invalid) {
      onFailure?.(this.errors);
      return Promise.reject(this.errors);
    }

    onSuccess?.(this.value);
    return Promise.resolve(this.value);
  }

  public setErrors(errors: ValidationErrors): void {
    super.setErrors(errors);
  }

  public setServerError(message: string): void {
    const { value } = this;

    this._serverError = {
      value,
      message,
    };
  }

  public removeServerError(): void {
    this._serverError = null;
  }

  /**
   * Returns full list of errors in form
   */
  public getErrorsRecursively(): ValidationErrorsWithControl | null {
    const errors: ValidationErrorsWithControl = {};

    if (!this.errors) return null;

    for (const key of Object.keys(this.errors)) {
      errors[key] = {
        ...this.errors[key],
        control: this
      }
    }

    const assign = (errorsToAssign: ValidationErrorsWithControl) => {
      for (let key of Object.keys(errorsToAssign)) {
        const value = errorsToAssign[key];

        while (Object.keys(errors).includes(key)) {
          key = `_${key}`;
        }

        Object.assign(errors, { [key]: value });
      }
    }

    for (const key of Object.keys(this.controls)) {
      const control = this.controls[key];

      if (control.valid) {
        continue;
      }

      if (control instanceof ReactiveControl) {
        const err = control.errors;
        if (err) {
          for (const key of Object.keys(err)) {
            err[key] = {
              ...err[key],
              control
            }
          }
          assign({ ...err });
        }
      }

      if (control instanceof ReactiveGroup) {
        const err = control.getErrorsRecursively();
        if (err)
          assign(err);
      }

      if (control instanceof ReactiveArray) {
        const err = control.getErrorsRecursively();
        if (err)
          assign(err);
      }
    }

    if (!Object.keys(errors).length) {
      return null;
    }

    return errors;
  }

  public getErrorsListRecursively(): List<ValidationErrorsWithControl> | null {
    return List.fromObject<ValidationErrorsWithControl>(this.getErrorsRecursively());
  }

  public get<T = (ReactiveAbstract | null)>(path: string | (string | number)[]): T {
    return super.get(path) as unknown as T;
  }

  public reset(): void {
    super.reset();
    this._submitted = false;
  }

}

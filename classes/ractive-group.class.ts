import { FormGroup } from '@angular/forms';
import { ValidationErrors } from '../inerfaces/validation-error.interface';
import { ReactiveControl } from './reactive-control.class';
import { ServerError } from '../inerfaces/server-error.interface';
import { ReactiveArray } from './reactive-array.class';
import { ReactiveAbstract } from '../types/reactive-abstract.type';

export class ReactiveGroup<T = any> extends FormGroup {

  public value: T;
  public touched = false;

  private _serverError?: ServerError;
  private _submitted = false;

  /**
   * Returns true if the formGroup was previously submitted
   */
  public get submitted(): boolean {
    return this._submitted;
  }

  /**
   * Returs errors from server after submitting formGroup
   */
  public get serverError(): ServerError | null {
    return this._serverError;
  }

  /**
   * Submits formGroup (validating all the fields and submitting them)
   * @returns promise with resolve(value) or reject(validationerrors)
   */
  public submit(): Promise<T> {
    this._submitted = true;
    for (const key of Object.keys(this.controls)) {
      if (this.controls[key] instanceof ReactiveControl) {
        (this.controls[key] as ReactiveAbstract).submit();
      }
    }

    this.markAllAsTouched();

    if (!this.valid) {
      return Promise.reject(this.errors);
    }
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
    }
  }

  public removeServerError(): void {
    this._serverError = null;
  }

  public getErrorsFromChildren(): ValidationErrors {
    const errors = {};

    for (const key of Object.keys(this.controls)) {
      const control = this.controls[key];

      if (control.valid) {
        continue;
      }

      if (control instanceof ReactiveControl) {
        Object.assign(this.errors, control.errors);
      }

      if (control instanceof ReactiveGroup) {
        Object.assign(this.errors, control.getErrorsFromChildren());
      }
    }

    if (!Object.keys(errors).length) {
      return null;
    }

    return errors;
  }

  public markAsTouched(opts?: {
    onlySelf?: boolean;
  }): void {
    this.touched = true;
    super.markAsTouched(opts);
  }

  public markAsUntouched(opts?: {
    onlySelf?: boolean;
  }): void {
    this.touched = false;
    super.markAsUntouched(opts);
  }

  public get(path: string | (string | number)[]): ReactiveControl | ReactiveArray | ReactiveGroup {
    return super.get(path) as (ReactiveControl | undefined);
  }

  public reset() {
    super.reset();
    this._submitted = false;
  }
}
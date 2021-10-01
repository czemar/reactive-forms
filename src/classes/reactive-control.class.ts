import { FormControl } from '@angular/forms';
import { List } from './list.class';
import { ValidationErrors } from '../interfaces/validation-error.interface';

export class ReactiveControl<T = any> extends FormControl {

  public value!: T | null;

  private _submitted = false;

  public get submitted(): boolean {
    return this._submitted;
  }

  /**
   * Returns list of errors based on errors property
   */
  public get errorsList() {
      return List.fromObject<ValidationErrors>(this.errors);
  }

  public submit(): void {
    this._submitted = true;

    this.markAllAsTouched();
  }

  public reset(): void {
    super.reset();
    this._submitted = false;
  }

}
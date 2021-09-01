import { EventEmitter, Input, OnDestroy, OnInit, Output, Component } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Subscription, delay } from 'rxjs';
import { ReactiveControl } from './reactive-control.class';
@Component({
  template: ''
})
// tslint:disable-next-line: component-class-suffix
export abstract class ReactiveAccessor<T = string> implements ControlValueAccessor, OnInit, OnDestroy {

    @Input() control: ReactiveControl<T> = new ReactiveControl<T>('');
    @Input() label = '';

    @Output() valueChanges: EventEmitter<T> = new EventEmitter<T>();

    private _touchChangesSubscription: Subscription;
    private _valueChangesSubscrition: Subscription;

    private _onTouched = () => {};
    private _onChange = (_: T) => {};

    ngOnDestroy(): void {
        this._touchChangesSubscription?.unsubscribe();
        this._valueChangesSubscrition?.unsubscribe();
    }

    ngOnInit(): void {
        this._touchChangesSubscription = this.control.statusChanges.pipe(delay(50)).subscribe(() => {
            if (this.control.touched) {
                this._onTouched();
            }
        });

        this._valueChangesSubscrition = this.control.valueChanges.subscribe((val) => {
            this.valueChanges.emit(val);
            this._onChange(val);
        });
    }

    writeValue(value: T): void {
        this.control.setValue(value);
    }

    registerOnChange(fn: (_: T) => {}): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => {}): void {
        this._onTouched = fn;
    }

    setEnabledState?(isEnabled: boolean): void {
        if (isEnabled) {
            this.control.enable();
        } else {
            this.control.disable();
        }
    }

    disable(): void {
        this.setEnabledState(false);
    }

    enable(): void {
        this.setEnabledState(true);
    }

}

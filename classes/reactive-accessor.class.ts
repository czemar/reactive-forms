import { EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import { Subscription } from "rxjs";
import { ReactiveControl } from "./reactive-control.class";

export class ReactiveAccessor<T = string> implements ControlValueAccessor, OnInit, OnDestroy {

    @Input() control: ReactiveControl<T> = new ReactiveControl<T>('');
    @Input() label: string = '';

    @Output() valueChanges: EventEmitter<T> = new EventEmitter<T>();

    private _onTouched = () => {};
    private _onChange = (_: T) => {};

    private _touchChangesSubscription: Subscription;
    private _valueChangesSubscrition: Subscription;

    ngOnDestroy(): void {
        this._touchChangesSubscription?.unsubscribe();
        this._valueChangesSubscrition?.unsubscribe();
    }

    ngOnInit(): void {

        this._touchChangesSubscription = this.control.touchChanges.subscribe((touchedState) => {
            if (touchedState) {
                this._onTouched();
            }
        });

        this._valueChangesSubscrition = this.control.valueChanges.subscribe((val) => {
            this.valueChanges.emit(val);
            this._onChange(val);
        })
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
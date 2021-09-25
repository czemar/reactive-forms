var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { EventEmitter, Input, Output, Component } from '@angular/core';
import { delay } from 'rxjs';
import { ReactiveControl } from './reactive-control.class';
let ReactiveAccessor = 
// tslint:disable-next-line: component-class-suffix
class ReactiveAccessor {
    constructor() {
        this.control = new ReactiveControl('');
        this.label = '';
        this.valueChanges = new EventEmitter();
        this._onTouched = () => { };
        this._onChange = (_) => { };
    }
    ngOnDestroy() {
        this._touchChangesSubscription?.unsubscribe();
        this._valueChangesSubscrition?.unsubscribe();
    }
    ngOnInit() {
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
    writeValue(value) {
        this.control.setValue(value);
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    setEnabledState(isEnabled) {
        if (isEnabled) {
            this.control.enable();
        }
        else {
            this.control.disable();
        }
    }
    disable() {
        this.setEnabledState(false);
    }
    enable() {
        this.setEnabledState(true);
    }
};
__decorate([
    Input()
], ReactiveAccessor.prototype, "control", void 0);
__decorate([
    Input()
], ReactiveAccessor.prototype, "label", void 0);
__decorate([
    Output()
], ReactiveAccessor.prototype, "valueChanges", void 0);
ReactiveAccessor = __decorate([
    Component({
        template: ''
    })
    // tslint:disable-next-line: component-class-suffix
], ReactiveAccessor);
export { ReactiveAccessor };

import { FormControl, ValidationErrors } from "@angular/forms";

export class MyValidators {
    // whitespace validation
    static notOnlyWhitespace(control: FormControl) : ValidationErrors| null {
        if ((control.value != null) && (control.value.trim().length === 0))  { // trim will remove all white space
            return { 'notOnlyWhitespace': true };
        } else {
            return null;
        }
    }
}

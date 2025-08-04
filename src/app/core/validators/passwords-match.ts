import { AbstractControl, ValidatorFn } from "@angular/forms";

export const PasswordsMatch: ValidatorFn = (
  control: AbstractControl
  // @ts-ignore
): { [p: string]: boolean } | null => {
  const password = control.get("password") || control.get("newPassword");
  const confirmPassword = control.get("confirmPassword") || control.get("newPasswordTwo");
  if (password?.value === confirmPassword?.value) {
    return null;
  } else {
    confirmPassword?.setErrors({ notMatched: true });
    // return null
  }
};

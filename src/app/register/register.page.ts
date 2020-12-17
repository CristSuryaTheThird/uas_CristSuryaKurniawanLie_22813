import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { NavController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth.service";
import { ApkService } from '../services/apk.service';
import {User} from '../model/user';
@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = "";
  successMessage: string = "";
  user: User;
  validation_messages = {
    fname: [
      { type: "required", message: "First Name is required." },
    
    ],
    lname: [
      { type: "required", message: "Last Name is required." },
    
    ],
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email" },
    ],
    password: [
      { type: "required", message: "password is required." },
      {
        type: "minlength",
        message: "password must be at least 5 character long.",
      },
    ],
   
  };

  constructor(
    private navCtrl: NavController,
    private authSrv: AuthService,
    private formBuilder: FormBuilder,
    private apkSrv: ApkService,
  ) {}
  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      fname: new FormControl(
        "",
          Validators.compose([
          Validators.required
        ])
      ),
        lname: new FormControl(
          "",
          Validators.compose([
          Validators.required
        ])
      ),
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-z0-9_.+-]+@[a-zA-z0-9-]+.[a-zA-z0-9-.]+$"),
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
      passwordConfirm: new FormControl(
        "",
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
      check: new FormControl(
        false, 
          Validators.compose([
          Validators.requiredTrue 
        ])
      ),
    }
     ,{validators: RegisterPage.passwordMatch}
    );
  }

  // passwordMatching(field_name): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } => {
  //       let input = control.value;
  //       let isValid = control.root.value[field_name] == input;
  //       if (!isValid)
  //           return {'equalTo': {isValid}};
  //       else
  //           return null;
  //   };
// }

  static passwordMatch(formGroup: FormGroup): {[err: string]: any} {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('passwordConfirm');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }
  tryRegister(value) {
    this.authSrv.registerUser(value).then(
      (res) => {
        console.log(res.user.uid);
        this.user ={
          uid: res.user.uid,
          firstName: value.fname,
          lastName: value.lname,
          password: value.password,
          email: value.email
        }
        this.errorMessage = "";
        this.successMessage = "Your account has been created. Please log in.";
        this.apkSrv
      .createUser(this.user)
      .then((res) => {
        console.log(res);
        // this.router.navigateByUrl("/contact");
      })
      .catch((error) => console.log(error));
      },
      (err) => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      }
    );
  }

  goLoginPage() {
    this.navCtrl.navigateBack("/login");
  }
}

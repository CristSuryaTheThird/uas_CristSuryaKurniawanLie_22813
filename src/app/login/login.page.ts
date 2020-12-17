import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { NavController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = "";

  constructor(
    private navCtrl: NavController,
    private authSrv: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-z0-9_.+-]+@[a-zA-z0-9-]+.[a-zA-z0-9-.]+$"),
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ),
    });
  }

  validation_messages = {
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Please enter a valid email" },
    ],
    password: [{ type: "required", message: "password is required." },
    {
      type: "minlength",
      message: "password must be at least 6 character long.",
    },],
  };

  loginUser(value) {
    this.authSrv.loginUser(value).then(
      (res) => {
        console.log(res);
        this.errorMessage = "";
        this.navCtrl.navigateForward("/dashboard");
      },
      (err) => {
        this.errorMessage = err.message;
      }
    );
  }

  goRegisterPage() {
    this.navCtrl.navigateForward("/register");
  }
}

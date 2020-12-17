import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private dbPath = "/user"
  userRef: AngularFireList<String> = null
  constructor(private fireAuth: AngularFireAuth) {}

  registerUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
    });
  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth
        .signInWithEmailAndPassword(value.email, value.password)
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
    });
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      this.fireAuth
        .signOut()
        .then(() => {
          console.log("Log Out");
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  userDetails() {
    return this.fireAuth.user;
  }
}

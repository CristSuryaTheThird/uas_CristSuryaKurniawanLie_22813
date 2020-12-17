import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor( private authSrv: AuthService, private router: Router) { }

  ngOnInit() {
    this.authSrv.userDetails().subscribe(
      (res) => {
        console.log("res:", res);
        console.log("uid: ", res.uid);
        if (res == null) {
          this.router.navigateByUrl("/login");
        } 
      },
      (err) => {
        console.log(err);
      }
    );
  }

}

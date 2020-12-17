import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApkService } from 'src/app/services/apk.service';
import { AuthService } from 'src/app/services/auth.service';
import {Friend} from '../../../model/friend';
import { map } from "rxjs/operators";
@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.page.html',
  styleUrls: ['./addfriend.page.scss'],
})
export class AddfriendPage implements OnInit {
  currUser: string;
  res: any = [];
  allFriend: any;
  id: string;
  constructor(private authSrv:AuthService, private apkSrv: ApkService, private router: Router) {}

  ngOnInit() {
 
    this.authSrv.userDetails().subscribe(
      (res) => {
        this.currUser = res.uid.toString();
        if (res == null) {
          this.router.navigateByUrl("/login");
        } 
      },
      (err) => {
        console.log(err);
      }
    );
    
  }
  ionViewWillEnter(){
    this.apkSrv.getAllFriend().snapshotChanges().pipe(
      map((changes) =>
        changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe((data)=>{
      this.allFriend = data;
    })
   
  }

  onSubmit(form: NgForm) {
    const friend = {
      userKey: this.currUser,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      lokasi: form.value.lokasi,
      latitude: form.value.latitude.toString(),
      longitude: form.value.longitude.toString()
    }
    form.setValue(friend);

    this.apkSrv
      .createFriend(form.value)
      .then((res) => {
        console.log(res);
        // this.router.navigateByUrl("/contact");
      })
      .catch((error) => console.log(error));

    form.reset();
    this.router.navigateByUrl("/dashboard/tabs/friendlist");
  }

}

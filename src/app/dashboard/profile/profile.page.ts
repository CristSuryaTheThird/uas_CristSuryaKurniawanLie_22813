import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { ApkService } from 'src/app/services/apk.service';
import { AuthService } from 'src/app/services/auth.service';
import {Checkin} from '../../model/checkin';
import { map } from "rxjs/operators";
import { User } from 'src/app/model/user';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  allUser: any;
  currUser: string;
  firstName: string;
  lastName: string;
  allCheckIn: any;
  myCheckIn: Checkin[] = [];
  constructor(private authSrv: AuthService, private router: Router, private navCtrl: NavController, private apkSrv:ApkService, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.authSrv.userDetails().subscribe(
      (res) => {
       this.currUser = res.uid.toString();
       this.getData()
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
   this.getData()

  }

  getData(){
    this.apkSrv.getAllCheckIn().snapshotChanges().pipe(
      map((changes) =>
        changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe((data)=>{
      this.allCheckIn = data;
      this.myCheckIn = [];
      this.allCheckIn.forEach(element => {
        if(this.currUser == element.userKey.toString()){
          const chk:Checkin = {
            checkInId: element.key.toString(),
            userKey: this.currUser,
            location: element.location.toString(),
            latitude: element.latitude.toString(),
            longitude: element.longitude.toString(),
            time: element.time
          };
          this.myCheckIn.push(chk);

        }else{
          console.log("boooooo");
        }

      });


    })

    this.apkSrv.getAllUser().snapshotChanges().pipe(
      map((changes) =>
        changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe((data)=>{
      this.allUser = data;
      this.allUser.forEach(element => {
        if(this.currUser == element.uid.toString()){
         this.firstName = element.firstName.toString();
         this.lastName = element.lastName.toString();
        }
      });


    })
  }
async deleting(key: string){
  const alert = await this.alertCtrl.create({
    header: "Check-In Delete",
    message:
      "Apakah yakin ingin menghapus check in ini? ",
    buttons: [
      {
        text: "Cancel",
        role: "cancel",
      },
      {
        text: "Ok",
        handler: () => this.deleteCheckIn(key),
      },
    ],
  });
  await alert.present();
}
deleteCheckIn(key: string){
  this.apkSrv.deleteCheckIn(key).then((res)=>{
    console.log(res);
  })
}

  logout() {
    this.authSrv.logoutUser().then(
      (res) => {
        console.log(res);
       
        this.navCtrl.navigateBack("");
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

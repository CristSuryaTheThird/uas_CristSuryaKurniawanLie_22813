import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { Friend } from 'src/app/model/friend';
import { ApkService } from 'src/app/services/apk.service';
import { AuthService } from 'src/app/services/auth.service';
import { map } from "rxjs/operators";
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-friendlist',
  templateUrl: './friendlist.page.html',
  styleUrls: ['./friendlist.page.scss'],
})
export class FriendlistPage implements OnInit {
  allFriend: any;
  myFriend: Friend[] = [];
  filterFriend: Friend[] = [];
  currUser: string;
  noImage: string;
  constructor(private authSrv: AuthService, private apkSrv: ApkService, private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.noImage =  'assets/noImage.png';
    this.authSrv.userDetails().subscribe(
      (res) => {
        // console.log("res:", res);
        // console.log("uid: ", res.uid);
        this.currUser = res.uid.toString();
           
        this.getData();
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
   
    this.getData();
    
  }

  getData(){
    this.apkSrv.getAllFriend().snapshotChanges().pipe(
      map((changes) =>
        changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe((data)=>{
      this.allFriend = data;
      console.log(this.allFriend.length);
      this.myFriend = [];
      this.allFriend.forEach(element => {
        if(this.currUser == element.userKey.toString()){
          const friend:Friend = {
            friendId: element.key.toString(),
            userKey: this.currUser,
            firstName: element.firstName.toString(),
            lastName: element.lastName.toString(),
            lokasi: element.lokasi.toString(),
            latitude: element.latitude.toString(),
            longitude: element.longitude.toString(),
          };

 
          this.myFriend.push(friend);

        }else{
          console.log("boooooo");
        }
       

      });
      this.filterFriend = this.myFriend;

    })
  }
  AddForm() {
    this.router.navigate(["/dashboard/tabs/friendlist/addfriend"]);
  }

  async parseDelete(key: string){
    const alert = await this.alertCtrl.create({
      header: "Delete Friend",
      message: "Do you want to delete this friend",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Ok",
          handler: () => this.deleteFriend(key),
        },
      ],
    });
    await alert.present();
  }

  deleteFriend(key:string){
    this.apkSrv.deleteFriend(key).then((res) => {
      console.log(res);
    });
  }

  filter(ev:any){
    const val = ev.target.value;
    if(val && val.trim() != ''){
     
      this.filterFriend = this.myFriend.filter((item)=>{
        return ((item.firstName.toLowerCase()+" "+item.lastName.toLowerCase()).indexOf(val.toLowerCase())>-1);
      })
    }else{
      this.filterFriend = this.myFriend;
    }
  }


}

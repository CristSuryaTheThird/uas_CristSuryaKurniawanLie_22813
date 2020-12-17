import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {Checkin} from '../../model/checkin';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, IonInput, ToastController } from '@ionic/angular';
import { ApkService } from 'src/app/services/apk.service';
import { NgForm } from '@angular/forms';
import { map } from "rxjs/operators";
import {Friend} from '../../model/friend';
declare var google: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  normalState: boolean;
  map: any;
  kordinat: any;
  currUser: string;
  infoWindow: any = new google.maps.InfoWindow();
  checkin: Checkin;
  myCheckIn: string ="";
  form : NgForm;
  myFriend: Friend[] = []
  allFriend: any;
  time;
  idx: number;
  @ViewChild('map', {read: ElementRef, static:false}) mapRef: ElementRef;
  // @ViewChild('myCheckIn') chk: IonInput;
  umnPos: any = {
    lat: -6.256081,
    lng: 106.618755
  };

  constructor(private authSrv:AuthService, private router:Router, private alertCtrl:AlertController, private apkSrv: ApkService, private toastController: ToastController) { }

  ngOnInit() {
    this.idx = 1;
    this.authSrv.userDetails().subscribe(
      (res) => {
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
      if( this.idx == 1){
        this.showMap(this.umnPos);
        this.idx = 0;
      }
      
    })
  }
  ionViewDidEnter(){
    this.normalState = true;
    this.time = new Date;
    console.log(this.time);
  }

  showMap(pos: any){
 
    const location = new google.maps.LatLng(pos.lat, pos.lng);
    const options = {
      center: location,
      zoom: 13,
      disableDefaultUI: true,
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.centerLoc();
   
  }
  centerLoc(){
    const icon = {
      url: 'assets/marker2.png', // image url
      scaledSize: new google.maps.Size(35, 35), // scaled size
    };
    const Friendicon = {
      url: 'assets/friendMarker.png', // image url
      scaledSize: new google.maps.Size(35, 35), // scaled size
    };
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position: Position)=>{
   
        const pos={
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.kordinat = pos;
        const marker = new google.maps.Marker({
          position: pos, //marker position
          map: this.map, //map already created
          title: 'currLoc',
          icon: icon //custom image
        });
        this.myFriend.forEach((element)=>{
          const friendPos = {
            lat: parseFloat(element.latitude),
            lng: parseFloat(element.longitude),
          }
         
          const friendMarker = new google.maps.Marker({
            position: friendPos, //marker position
            map: this.map, //map already created
            title: 'friendLoc',
            icon: Friendicon //custom image
          });
        })
        this.map.setCenter(pos);
      })
      
    }
  }

  changeNormalState(){
    this.normalState = false;
  }
  returnNormalState(){
    this.normalState = true;
    this.myCheckIn = "";
  }

  async checkIn(){
    console.log(this.myCheckIn);
    if(this.myCheckIn.trim() != ''){
      const alert = await this.alertCtrl.create({
        header: "Check-In",
        message:
          "Apakah yakin ingin melakukan check in pada "+this.myCheckIn,
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Ok",
            handler: () => this.insertCheckIn(),
          },
        ],
      });
      await alert.present();
    }
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: "you have Checked-In",
      duration: 500,
    });
    toast.present();
  }
  insertCheckIn(){
    // this.checkin = {
    //   checkInId: 
    // }
    console.log(this.kordinat);
    const chk = {
      // checkInId: "",
      userKey: this.currUser.toString(), 
      location: this.myCheckIn.toString(), 
      latitude: this.kordinat.lat,
      longitude: this.kordinat.lng,
      time: this.time
    }

    this.apkSrv
    .createCheckIn(chk)
    .then((res) => {
      console.log(res);
      this.myCheckIn = "";
      this.presentToast();
      // this.router.navigateByUrl("/contact");
    })
    .catch((error) => console.log(error));
  }


}

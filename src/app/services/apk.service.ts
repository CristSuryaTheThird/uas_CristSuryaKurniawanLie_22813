import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import {User} from "../model/user";
import {Friend} from "../model/friend";
import {Checkin} from "../model/checkin";
@Injectable({
  providedIn: 'root'
})
export class ApkService {
  private dbPath = "/user"
  private dbPath2 = "/friend"
  private dbPath3 = "/checkIn"
  userRef: AngularFireList<User> = null
  friendRef:AngularFireList<Friend> = null
  checkinRef:AngularFireList<Checkin> = null
  constructor(private db: AngularFireDatabase) {
    this.userRef = this.db.list(this.dbPath);
    this.friendRef = this.db.list(this.dbPath2);
    this.checkinRef = this.db.list(this.dbPath3);
  }
  createUser(user: User): any {
    return this.userRef.push(user);
  }
  createFriend(friend: Friend): any{
    return this.friendRef.push(friend);
  }
  createCheckIn(checkin: any): any{
    return this.checkinRef.push(checkin);
  }
  getAllFriend(): AngularFireList<Friend>{
    return this.friendRef;
  }
  getAllCheckIn(): AngularFireList<Checkin>{
    return this.checkinRef;
  }
  getAllUser(): AngularFireList<User>{
    return this.userRef;
  }
  deleteFriend(key: string): Promise<void> {
    return this.friendRef.remove(key);
  }
  deleteCheckIn(key: string): Promise<void>{
    return this.checkinRef.remove(key);
  }
}


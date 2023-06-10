import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import {User} from '@firebase/auth-types'
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  user$!:Observable<User | null>
  users$!:Observable<User[] | null>

  constructor(private auth:AngularFireAuth) {}

  ngOnInit(): void {
    this.user$ = this.auth.authState
    // this.users$ = this.auth.listUsers()
  }
}

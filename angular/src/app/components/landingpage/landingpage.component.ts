import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {GoogleAuthProvider} from 'firebase/auth'
import { AngularFireModule } from '@angular/fire/compat';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit{
  constructor(private auth:AngularFireAuth, private router:Router) {
    
  }

  ngOnInit(): void {
    this.auth.getRedirectResult().then(result => {
      result.user !== null ? this.router.navigate(['']) : ''
    })
  }

  signInWithGoogle() {
    this.auth.signInWithRedirect(new GoogleAuthProvider())
  }
}

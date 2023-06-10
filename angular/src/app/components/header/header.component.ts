import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '@firebase/auth-types';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user$!:Observable<User | null>

  constructor(private auth:AngularFireAuth, private router:Router) {}

  ngOnInit(): void {
    this.user$ = this.auth.authState
    this.user$.subscribe(user => {
      console.log(user);
    })
  }
  
  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['welcome']);
    }).catch((error) => {
      console.error('signout error:', error);
    });
  }
  
}

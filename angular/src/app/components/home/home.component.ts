import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map, take } from 'rxjs';
import {User} from '@firebase/auth-types'
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/compat/firestore'
import { Iquestion, Iuser } from 'src/app/interfaces';
import { RemoveAuthUserPipe } from 'src/app/pipes/remove-auth-user.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RemoveAuthUserPipe, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  user$!:Observable<User | null>
  usersCol!:AngularFirestoreCollection<Iuser>
  users$!:Observable<Iuser[] | null>
  questions$!:Observable<Iquestion[] | null>

  constructor(private auth:AngularFireAuth, private firestore:AngularFirestore, private router:Router) {}

  ngOnInit(): void {
    this.user$ = this.auth.authState
    this.usersCol = this.firestore.collection<Iuser>('users')
    this.users$ = this.usersCol.valueChanges()
    this.questions$ = this.firestore.collection<Iquestion>('questions', (ref)=> ref.orderBy('title')).valueChanges({idField: 'id'})
    this.user$.pipe(take(1)).subscribe(user => this.router.navigate(['/user', user?.uid]))
    
  }
}

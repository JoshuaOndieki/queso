import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '@firebase/auth-types';

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    user$!:Observable<User | null>
    
    constructor(private router:Router, private auth:AngularFireAuth) {
    }

    ngOnInit(): void {
        
    }
}

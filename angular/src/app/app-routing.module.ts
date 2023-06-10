import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { HomeComponent } from './components/home/home.component';
import {AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/compat/auth-guard'

const redirectUnauthorizedToLanding = () => redirectUnauthorizedTo(['welcome'])
const redirectUsersToHome = () => redirectLoggedInTo([''])

const routes: Routes = [
  {path: 'welcome', component:LandingpageComponent, canActivate:[AngularFireAuthGuard], data: {authGuardPipe:redirectUsersToHome}},
  {
    path: '',
    loadComponent:()=>import('./components/home/home.component').then(c=>c.HomeComponent), canActivate:[AngularFireAuthGuard],
    data:{authGuardPipe:redirectUnauthorizedToLanding},
    children: [
      {path: 'user/:id', loadComponent: ()=>import('./components/user/user.component').then(c=>c.UserComponent)},
  ]},
  {path:'**', loadComponent:()=>import('./components/not-found/not-found.component').then(c=>c.NotFoundComponent)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

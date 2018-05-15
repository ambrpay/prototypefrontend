import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { AddComponent } from './add/add.component';
import { SubscribeComponent } from './subscribe/subscribe.component';

const routes: Routes = [
  { path: 'add/:issuer', component: SubscribeComponent},
  { path: 'o', component:  LayoutComponent},
  { path: 'm/:issuer', component:  AddComponent},
  { path: '', component:  AppComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemebersListComponent } from './members/memebers-list/memebers-list.component';
import { ListComponent } from './list/list.component';
import { MessagesComponent } from './messages/messages.component';
import { MemeberDetailsComponent } from './members/memeber-details/memeber-details.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path:'', component:HomeComponent},
  { path:'', 
    runGuardsAndResolvers:'always',
    canActivate:[AuthGuard],
    children:[
      {path:'members', component: MemebersListComponent},
      {path:'members/:id', component: MemeberDetailsComponent},
      {path:'list', component: ListComponent},
      {path:'messages', component : MessagesComponent}
    ]
  },  
  {path:'**', component: HomeComponent, pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemebersListComponent } from './members/memebers-list/memebers-list.component';
import { ListComponent } from './list/list.component';
import { MessagesComponent } from './messages/messages.component';
import { MemeberDetailsComponent } from './members/memeber-details/memeber-details.component';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { UploadComponent } from './File/upload/upload.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';

const routes: Routes = [
  {path:'', component:HomeComponent},
  { path:'', 
    runGuardsAndResolvers:'always',
    canActivate:[AuthGuard],
    children:[
      {path:'members', component: MemebersListComponent},
      {path:'members/:username', component: MemeberDetailsComponent},
      {path:'member/edit', component: MemberEditComponent, canDeactivate:[preventUnsavedChangesGuard]},
      {path:'list', component: ListComponent},
      {path:'messages', component : MessagesComponent}
    ]
  },
  {path:'not-found', component: NotFoundComponent} ,
  {path:'errors', component:ServerErrorComponent},
  {path:'file', component: UploadComponent} ,
  {path:'**', component: HomeComponent, pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

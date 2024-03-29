import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharactersComponent } from './characters/characters.component';
import { ClassesComponent } from './classes/classes.component';
import { ItemsComponent } from './items/items.component';
import { SpellsComponent } from './spells/spells.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { ViewUsersComponent } from './view-users/view-users.component'
import { AdminAddComponent } from './admin-add/admin-add.component'
import { AdminDeleteComponent } from './admin-delete/admin-delete.component'
import { AdminComponent } from './admin/admin.component';
import { CreateCharactersComponent } from './characters/create-characters/create-characters.component';
import { SignupComponent } from './signup/signup.component';
import { PasswordComponent } from './users/users-edit/password/password.component';
import { NameComponent } from './users/users-edit/name/name.component';
import { EmailComponent } from './users/users-edit/email/email.component';
import { HomeComponent } from './home/home.component';
import { CharactersItemsComponent } from './characters/characters-items/characters-items.component';
import { CharactersSpellsComponent } from './characters/characters-spells/characters-spells.component';

//Routing for the Entire Application
//NOTE: path must match the routerLink indicated in app.component.html
const routes: Routes = [
  { path: '', component: HomeComponent },

  //If user not logged in, display login and create user tabs only
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  
  //If user is logged in, display the following tabs
  { path: 'profile', component: UsersComponent },
  { path: 'profile/name', component: NameComponent },
  { path: 'profile/email', component: EmailComponent },
  { path: 'profile/pass', component: PasswordComponent },
  { path: 'profile/create-character', component: CreateCharactersComponent },
  { path: 'profile/characters', component: CharactersComponent },
  { path: 'profile/items', component: CharactersItemsComponent },
  { path: 'profile/spells', component: CharactersSpellsComponent },

  //If user is admin, display following tabs
  { path: 'admin', component: AdminComponent },
  { path: 'admin/view-users', component: ViewUsersComponent },
  { path: 'admin/add-spells-and-items', component: AdminAddComponent },
  { path: 'admin/delete-spells-and-items', component: AdminDeleteComponent },

  //All logged in users can view these pages
  { path: 'classes', component: ClassesComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'spells', component: SpellsComponent },
];

export const appRoutingModule = RouterModule.forRoot(routes);
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

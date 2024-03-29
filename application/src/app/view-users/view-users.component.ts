import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})

export class ViewUsersComponent {
  Users: myUser[];
  curUser: myUser;
  text: string;
  view: boolean;
  viewUsersSubmitted: Boolean;
  deleteUserSubmitted: Boolean;
  editUsersSubmitted: Boolean;
  // Stores user edit form data
  form: FormGroup = new FormGroup({});


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.Users = [];
    this.curUser = new myUser("Name", "Username", "Email", -1, false, "********");
    this.text = "Hide All Users";
    this.view = false;
    this.viewUsersSubmitted = false;
    this.editUsersSubmitted = false;
    this.deleteUserSubmitted = false;
  }

  ngOnInit() {
    if (localStorage.getItem('id_token') === null || localStorage.getItem('adminstatus') !== 'true') {
      this.router.navigateByUrl('/');
    }

    this.viewUsers();

    // Same validation here as signup form validation
    this.form = this.fb.group({
      name: new FormControl("", [Validators.minLength(4), Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]),
      email: new FormControl("", [Validators.email,]),
      password: new FormControl("", [Validators.minLength(8), Validators.maxLength(20),]),
    })
  }

  // Allow admin to view all characters
  viewUsers() {

    this.viewUsersSubmitted = true;

    // Post admin variable to get all users
    let Admin = {
      "UserToken": localStorage.getItem('id_token'),
    };
    const options = { headers: { 'Content-Type': 'application/json' } };
    this.http.post('http://localhost:8080/users/getall', JSON.stringify(Admin), options).subscribe(data => {

      if (200) {

        // All users in Users variable and stored in table
        this.Users.splice(0);
        var users = JSON.parse(JSON.stringify(data));
        for (let i = 0; i < users.length; i++) {
          var user = new myUser(users[i].Name, users[i].Username, users[i].Email, users[i].ID, users[i].IsAdmin, users[i].Password);
          this.Users.push(user);
        }
      }
    }, (error) => {
      if (error.status === 404) {
        alert('Resource not found.');
      }
      else if (error.status === 409) {
        alert('Character already exists. Please try another one.');
      }
      else if (error.status === 500) {
        alert('Server down.');
      }
      else if (error.status === 502) {
        alert('Bad gateway.');
      }
    })
  }

  // Get admin user option
  chooseUser() {
    const select = document.getElementById("chooseUser") as HTMLSelectElement;
    const index = select.selectedIndex;

    // Get selected index 
    if (index === 0 || index === -1 || index - 1 >= this.Users.length)
      return;

    // Current character equals user's selected option'
    var user = this.Users.at(index - 1)!;
    this.curUser = user;
    // this.curChar has to be set here
    //this.curChar = char;
  }

  // Edit user with admin info
  editUser() {

    // double check if submitted form is valid
    if (!this.form.valid)
      return;

    const select = document.getElementById("chooseUser") as HTMLSelectElement;
    const index = select.selectedIndex;

    // Get selected index 
    if (index === 0 || index === -1 || index - 1 >= this.Users.length)
      return;

    // Only update values that admin entered
    const name = document.getElementById("name") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;
    const pwd = document.getElementById("password") as HTMLInputElement;
    const adm = document.getElementById("Adm") as HTMLInputElement;

    this.curUser = this.Users.at(index - 1)!;

    if (name.value != "") {
      this.curUser.Name = name.value;
    }

    if (email.value != "") {
      this.curUser.Email = email.value;
    }

    if (pwd.value) {
      this.curUser.Password = pwd.value;
    }

    if (adm.checked === true) {
      this.curUser.IsAdmin = true;
    }

    const options = { headers: { 'Content-Type': 'application/json' } };
    if (confirm("Warning! Are you sure you want to edit this user? This is potentially a destructive action!")) {

      // Post admin and user data to edit user
      var Admin;
      if (pwd.value) {
        Admin = {
          "AuthToken": localStorage.getItem('id_token'),
          "Username": this.curUser.Username,
          "Name": this.curUser.Name,
          "Email": this.curUser.Email,
          "Password": this.curUser.Password,
          "IsAdmin": this.curUser.IsAdmin,
        }

      }
      else {
        Admin = {

          "AuthToken": localStorage.getItem('id_token'),
          "Username": this.curUser.Username,
          "Name": this.curUser.Name,
          "Email": this.curUser.Email,
          "IsAdmin": this.curUser.IsAdmin,
        }
      }
        
      this.http.put('http://localhost:8080/users/admin_update', JSON.stringify(Admin), options).subscribe(data => {
        if (200) {
          alert("User " + this.curUser.Username + " successfully updated.");
          this.editUsersSubmitted = false;
        }
      }, (error) => {
        if (error.status === 404) {
          alert('Resource not found.');
        }
        else if (error.status === 409) {
          alert('User already exists. Please try another one.');
        }
        else if (error.status === 500) {
          alert('Server down.');
        }
        else if (error.status === 502) {
          alert('Bad gateway.');
        }
      })

    }
  }

  // Admin can click to delete user (not yet implemented)
  deleteUser(username: string) {

    this.deleteUserSubmitted = true;

    if (confirm("Are you sure you want to permanently delete this user?")) {
      const opts = { headers: { 'Content-Type': 'application/json' }, body: { "AuthToken": localStorage.getItem('id_token'), "Username": username, }};
      this.http.delete('http://localhost:8080/users/delete', opts).subscribe(data => {
        if (202) {
          alert("User " + username + " deleted permanently.");
          window.location.reload();
        }
      }, (error) => {
        if (error.status === 404) {
          alert('Resource not found');
        }
        else if (error.status === 500) {
          alert('Server down.');
        }
        else if (error.status === 502) {
          alert('Bad gateway.');
        }
      }
      );
    }
    else {
      alert("User deletion canceled.");
    }
  }

  viewHide() {
    if (document.getElementById('tableData')?.style.visibility === "hidden")
    {
      this.text = "Hide All Users";
      var tablRow = document.getElementById('tableData');
      tablRow!.style.visibility = "visible";
      return;
    }

    else {
      var tablRow = document.getElementById('tableData');
      this.text = "View All Users";
      tablRow!.style.visibility = "hidden";
      return;
    }
  }

  edited(){
    
    if (this.editUsersSubmitted === false) {
      this.editUsersSubmitted = true;
    }

    return this.editUsersSubmitted;
  }

  back() {
    this.router.navigateByUrl("/admin");
  }
}

// User Info available for admin
class myUser {
  Name: string;
  Username: string;
  Email: string;
  ID: number;
  IsAdmin: boolean;
  adm: string;
  Password: string;
  constructor(name: string, username: string, email: string, id: number, isadmin: boolean, password: string) {
    this.Name = name;
    this.Username = username;
    this.Email = email;
    this.ID = id;
    this.IsAdmin = isadmin;
    this.Password = password;
    if (isadmin === true) {
      this.adm = "TRUE";
    }
    else {
      this.adm = "FALSE";
    }
  }
}

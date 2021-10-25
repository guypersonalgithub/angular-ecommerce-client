import { Component, OnInit } from '@angular/core';
import { UserSignUpDetails } from '../../models/UserSignUpDetails';
import { UserService } from '../../services/UserService';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public userSignUpDetails: UserSignUpDetails;
  private usersService: UserService;

  public signUpPage = 1;

  public IDs = [];

  public IDIsFine: any = true;

  constructor(usersService: UserService, private router: Router) {
    this.userSignUpDetails = new UserSignUpDetails();
    this.usersService = usersService;
   }

  public signUp(): void { // Signs up assuming everything in the form is fine according to the regex.
    const observable = this.usersService.signUp(this.userSignUpDetails);

    observable.subscribe(succesfulServerRequestData => {

      alert("Signed up successfully!");
      this.router.navigate(["/home"]);

    }, serverErrorResponse => { 
      alert ("Your email is already registered in our services, please try again with a different one.");
    });
  }

  public nextPage(): void { // Moves to the next page.

    if (!this.IDs[0]) {

      this.IDIsFine = "not loaded yet";

    }

    else {

      for (let i = 0; i < this.IDs.length; i++) {
        if (this.IDs[i].id_number == this.userSignUpDetails.id) {
          this.IDIsFine = false;
          break;
        }
      }
  
      if (this.IDIsFine) {
        this.signUpPage++;
      }

    }

  }

  public previousPage(): void { // Moves to the previous page.
    this.signUpPage--;
  }

  public backToHome(): void {

    this.router.navigate(["/home"]);

  }

  ngOnInit(): void {

    if (localStorage.getItem("token")) {

      localStorage.removeItem("token");

    }

    const observable = this.usersService.getIDs();
    observable.subscribe(succesfulServerRequestData => {
      
      this.IDs = succesfulServerRequestData;

    }, serverErrorResponse => { 
      alert ("It seems like the Heroku VM instance was sleeping, please refresh the page and try doing your desired action once again.");
    });

  }

}

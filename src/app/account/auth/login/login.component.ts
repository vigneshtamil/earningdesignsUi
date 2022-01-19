import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { apiService } from '../auth.service'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  error = '';
  returnUrl: string;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService, private apiService: apiService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      // email: ['admin@themesbrand.com', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
    });

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      this.apiService.login(this.loginForm.value).subscribe(data => {
        if (data.status == true) {
          Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: data.message, icon: 'success' })
  
          this.router.navigate([`/account/otpverified/${this.loginForm.value.mobile}`]);
          this.loginForm.reset()
        }
        else {
          // alert(data.message)
          Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: data.message, icon: 'error' })
        }
      })
    }
  }
}

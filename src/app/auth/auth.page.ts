import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { delay, from, tap } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: false,
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  onLogin() {
    this.isLoading = true;
    this.authService.login();
    from(
      this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in...' })
    )
      .pipe(
        tap((loadingEl) => loadingEl.present()),
        delay(1500)
      )
      .subscribe({
        next: (loadingEl) => {
          this.router.navigateByUrl('/places/tabs/discover');
          this.isLoading = false;
          loadingEl.dismiss();
        },
      });
  }

  onSubmit(form: NgForm) {
    console.log(form);
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLogin) {
      // send request to login
    } else {
      // send request to signup
    }
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }
}

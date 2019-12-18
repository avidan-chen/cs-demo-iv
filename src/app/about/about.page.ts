import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthMode } from '@ionic-enterprise/identity-vault';

import { AuthenticationService, IdentityService } from '@app/services';
import { User } from '@app/models';

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss']
})
export class AboutPage {
  user: User;
  authMode: string;
  bioType: string;

  constructor(
    private authentication: AuthenticationService,
    private identity: IdentityService,
    private navController: NavController
  ) {}

  async ionViewDidEnter() {
    this.identity.get().subscribe(u => (this.user = u));
    this.authMode = AuthMode[await this.identity.getAuthMode()];
    this.bioType = await this.identity.getBiometricType();
  }

  logout() {
    this.authentication
      .logout()
      .subscribe(() => this.navController.navigateRoot('/login'));
  }
}

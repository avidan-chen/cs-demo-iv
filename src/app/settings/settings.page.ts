import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthMode } from '@ionic-enterprise/identity-vault';

import { AuthenticationService, IdentityService, SettingsService } from '@app/services';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {
  useBiometrics: boolean;
  usePasscode: boolean;
  useSecureStorageMode: boolean;
  biometricType: string;

  constructor(
    private authentication: AuthenticationService,
    private identity: IdentityService,
    private navController: NavController,
    private settings: SettingsService
  ) {}

  async ngOnInit() {
    await this.identity.ready();
    await this.setAuthModeFlags();
    const type = await this.identity.getBiometricType();
    this.biometricType = this.translateBiometricType(type);
  }

  logout() {
    this.authentication.logout().subscribe(() => this.navController.navigateRoot('/login'));
  }

  async authModeChanged() {
    if (this.useSecureStorageMode) {
      await this.identity.setAuthMode(AuthMode.SecureStorage);
    } else if (this.useBiometrics && this.usePasscode) {
      await this.identity.setAuthMode(AuthMode.BiometricAndPasscode);
    } else if (this.useBiometrics && !this.usePasscode) {
      await this.identity.setAuthMode(AuthMode.BiometricOnly);
    } else if (this.usePasscode && !this.useBiometrics) {
      await this.identity.setAuthMode(AuthMode.PasscodeOnly);
    } else {
      await this.identity.setAuthMode(AuthMode.InMemoryOnly);
    }
    await this.setAuthModeFlags();
  }

  lock() {
    this.identity.lockOut();
  }

  private async setAuthModeFlags() {
    this.usePasscode = await this.identity.isPasscodeEnabled();
    this.useBiometrics = await this.identity.isBiometricsEnabled();
    this.useSecureStorageMode = await this.identity.isSecureStorageModeEnabled();

    this.settings.store({
      useBiometrics: this.useBiometrics,
      usePasscode: this.usePasscode,
      useSecureStorageMode: this.useSecureStorageMode
    });
  }
  private translateBiometricType(type: string): string {
    switch (type) {
      case 'touchID':
        return 'TouchID';
      case 'faceID':
        return 'FaceID';
    }

    return type;
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ModalController, Platform } from '@ionic/angular';
import {
  AuthMode,
  IonicIdentityVaultUser,
  IonicNativeAuthPlugin,
  DefaultSession,
  VaultConfig,
  VaultError,
  VaultErrorCodes
} from '@ionic-enterprise/identity-vault';

import { environment } from '@env/environment';
import { User } from '@app/models';
import { BrowserAuthPlugin } from '../browser-auth/browser-auth.plugin';
import { SettingsService } from '../settings/settings.service';
import { PinDialogComponent } from '@app/pin-dialog/pin-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class IdentityService extends IonicIdentityVaultUser<DefaultSession> {
  private user: User;

  constructor(
    private browserAuthPlugin: BrowserAuthPlugin,
    private http: HttpClient,
    private modalController: ModalController,
    private router: Router,
    private plt: Platform,
    private settings: SettingsService
  ) {
    super(plt, {
      restoreSessionOnReady: false,
      unlockOnReady: false,
      unlockOnAccess: true,
      lockAfter: 5000,
      hideScreenOnBackground: true
    });
  }

  get(): Observable<User> {
    if (!this.user) {
      return this.http.get<User>(`${environment.dataService}/users/current`).pipe(tap(u => (this.user = u)));
    } else {
      return of(this.user);
    }
  }

  async set(user: User, token: string): Promise<void> {
    this.user = user;
    // This is just one sample login workflow. It mostly respects the settigs
    // that were last saved with the exception that it uses "Biometrics OR Passcode"
    // in the case were both were saved and the user logged out.
    const mode = (await this.useBiometrics())
      ? AuthMode.BiometricOnly
      : (await this.settings.usePasscode())
      ? AuthMode.PasscodeOnly
      : (await this.settings.useSecureStorageMode())
      ? AuthMode.SecureStorage
      : AuthMode.InMemoryOnly;
    await this.login({ username: user.email, token: token }, mode);
  }

  private async useBiometrics(): Promise<boolean> {
    const use = await Promise.all([this.settings.useBiometrics(), this.isBiometricsAvailable()]);
    return use[0] && use[1];
  }

  async remove(): Promise<void> {
    await this.logout();
    this.user = undefined;
  }

  async getToken(): Promise<string> {
    if (!this.token) {
      await this.restoreSession();
    }
    return this.token;
  }

  async restoreSession(): Promise<DefaultSession> {
    try {
      return await super.restoreSession();
    } catch (error) {
      if (error.code === VaultErrorCodes.VaultLocked) {
        const vault = await this.getVault();
        await vault.clear();
      } else {
        throw error;
      }
    }
  }

  onSessionRestored(session: DefaultSession) {
    console.log('Session Restored: ', session);
  }

  onSetupError(error: VaultError): void {
    console.error('Get error during setup', error);
  }

  onConfigChange(config: VaultConfig): void {
    console.log('Got a config update: ', config);
  }

  onVaultReady(config: VaultConfig): void {
    console.log('The service is ready with config: ', config);
  }

  onVaultUnlocked(config: VaultConfig): void {
    console.log('The vault was unlocked with config: ', config);
  }

  async onPasscodeRequest(isPasscodeSetRequest: boolean): Promise<string> {
    const dlg = await this.modalController.create({
      backdropDismiss: false,
      component: PinDialogComponent,
      componentProps: {
        setPasscodeMode: isPasscodeSetRequest
      }
    });
    dlg.present();
    const { data } = await dlg.onDidDismiss();
    return data || '';
  }

  onVaultLocked() {
    this.router.navigate(['login']);
  }

  getPlugin(): IonicNativeAuthPlugin {
    if (this.plt.is('cordova')) {
      return super.getPlugin();
    }
    return this.browserAuthPlugin;
  }
}

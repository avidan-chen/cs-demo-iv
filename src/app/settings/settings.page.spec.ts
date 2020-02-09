import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';

import { SettingsPage } from './settings.page';
import { AuthenticationService, IdentityService, SettingsService } from '@app/services';
import {
  createIdentityServiceMock,
  createAuthenticationServiceMock,
  createSettingsServiceMock
} from '@app/services/mocks';
import { createNavControllerMock } from '@test/mocks';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let authentication;
  let identity;
  let navController;

  beforeEach(async(() => {
    authentication = createAuthenticationServiceMock();
    identity = createIdentityServiceMock();
    navController = createNavControllerMock();
    TestBed.configureTestingModule({
      declarations: [SettingsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthenticationService, useValue: authentication },
        { provide: IdentityService, useValue: identity },
        { provide: NavController, useValue: navController },
        { provide: SettingsService, useFactory: createSettingsServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logout', () => {
    it('calls the logout', () => {
      const auth = TestBed.inject(AuthenticationService);
      component.logout();
      expect(auth.logout).toHaveBeenCalledTimes(1);
    });
  });
});

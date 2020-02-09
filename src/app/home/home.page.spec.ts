import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';

import { HomePage } from './home.page';
import { AuthenticationService, TeaCategoriesService } from '@app/services';
import { createNavControllerMock } from '@test/mocks';
import { createAuthenticationServiceMock, createTeaCategoriesServiceMock } from '@app/services/mocks';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let authentication;
  let navController;
  let teaCategories;

  beforeEach(async(() => {
    authentication = createAuthenticationServiceMock();
    navController = createNavControllerMock();
    teaCategories = createTeaCategoriesServiceMock();
    TestBed.configureTestingModule({
      declarations: [HomePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthenticationService, useValue: authentication },
        { provide: NavController, useValue: navController },
        { provide: TeaCategoriesService, useValue: teaCategories }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
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

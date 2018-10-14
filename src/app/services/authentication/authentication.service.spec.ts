import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';
import { IdentityService, createIdentityServiceMock } from '../identity';

describe('AuthenticationService', () => {
  let authentication: AuthenticationService;
  let httpTestingController: HttpTestingController;

  let identityServiceMock;

  beforeEach(() => {
    identityServiceMock = createIdentityServiceMock();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        { provide: IdentityService, useValue: identityServiceMock }
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
  });

  beforeEach(inject(
    [AuthenticationService],
    (service: AuthenticationService) => {
      authentication = service;
    }
  ));

  it('injects', () => {
    expect(authentication).toBeTruthy();
  });

  describe('login', () => {
    it('POSTs the login', () => {
      authentication
        .login('thank.you@forthefish.com', 'solongDude')
        .subscribe();
      const req = httpTestingController.expectOne(
        `${environment.dataService}/login`
      );
      expect(req.request.method).toEqual('POST');
      req.flush({});
      httpTestingController.verify();
    });

    it('passes the credentials in the body', () => {
      authentication
        .login('thank.you@forthefish.com', 'solongDude')
        .subscribe();
      const req = httpTestingController.expectOne(
        `${environment.dataService}/login`
      );
      expect(req.request.body).toEqual({
        username: 'thank.you@forthefish.com',
        password: 'solongDude'
      });
      req.flush({});
      httpTestingController.verify();
    });

    describe('on success', () => {
      let response;
      beforeEach(() => {
        response = {
          success: true,
          token: '48499501093kf00399sg',
          user: {
            id: 42,
            firstName: 'Douglas',
            lastName: 'Adams',
            email: 'thank.you@forthefish.com'
          }
        };
      });

      it('resolves true', () => {
        authentication
          .login('thank.you@forthefish.com', 'solongDude')
          .subscribe(r => expect(r).toEqual(true));
        const req = httpTestingController.expectOne(
          `${environment.dataService}/login`
        );
        req.flush(response);
        httpTestingController.verify();
      });

      it('stores the token', async () => {
        authentication
          .login('thank.you@forthefish.com', 'solongDude')
          .subscribe();
        const req = httpTestingController.expectOne(
          `${environment.dataService}/login`
        );
        req.flush(response);
        httpTestingController.verify();
        expect(identityServiceMock.setToken).toHaveBeenCalledTimes(1);
        expect(identityServiceMock.setToken).toHaveBeenCalledWith(
          '48499501093kf00399sg'
        );
      });

      it('sets the identity', () => {
        authentication
          .login('thank.you@forthefish.com', 'solongDude')
          .subscribe();
        const req = httpTestingController.expectOne(
          `${environment.dataService}/login`
        );
        req.flush(response);
        httpTestingController.verify();
        expect(identityServiceMock.set).toHaveBeenCalledTimes(1);
        expect(identityServiceMock.set).toHaveBeenCalledWith({
          id: 42,
          firstName: 'Douglas',
          lastName: 'Adams',
          email: 'thank.you@forthefish.com'
        });
      });
    });

    describe('on failure', () => {
      let response;
      beforeEach(() => {
        response = { success: false };
      });

      it('resolves false', () => {
        authentication
          .login('thank.you@forthefish.com', 'solongDude')
          .subscribe(r => expect(r).toEqual(false));
        const req = httpTestingController.expectOne(
          `${environment.dataService}/login`
        );
        req.flush(response);
        httpTestingController.verify();
      });

      it('does not store the token', () => {
        authentication
          .login('thank.you@forthefish.com', 'solongDude')
          .subscribe();
        const req = httpTestingController.expectOne(
          `${environment.dataService}/login`
        );
        req.flush(response);
        httpTestingController.verify();
        expect(identityServiceMock.setToken).not.toHaveBeenCalled();
      });

      it('does not set the identity', () => {
        authentication
          .login('thank.you@forthefish.com', 'solongDude')
          .subscribe();
        const req = httpTestingController.expectOne(
          `${environment.dataService}/login`
        );
        req.flush(response);
        httpTestingController.verify();
        expect(identityServiceMock.set).not.toHaveBeenCalled();
      });
    });
  });

  describe('logout', () => {
    it('POSTs the logout', () => {
      let fired = false;
      authentication.logout().subscribe(() => (fired = true));
      const req = httpTestingController.expectOne(
        `${environment.dataService}/logout`
      );
      req.flush({});
      httpTestingController.verify();
      expect(fired).toBeTruthy();
    });

    it('removes the token from storage', () => {
      authentication.logout().subscribe();
      const req = httpTestingController.expectOne(
        `${environment.dataService}/logout`
      );
      req.flush({});
      expect(identityServiceMock.setToken).toHaveBeenCalledTimes(1);
      expect(identityServiceMock.setToken).toHaveBeenCalledWith('');
    });

    it('remove the identity', () => {
      authentication.logout().subscribe();
      const req = httpTestingController.expectOne(
        `${environment.dataService}/logout`
      );
      req.flush({});
      expect(identityServiceMock.remove).toHaveBeenCalledTimes(1);
    });
  });
});
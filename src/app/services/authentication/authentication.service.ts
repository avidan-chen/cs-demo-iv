import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { IdentityService } from '../identity';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private identity: IdentityService
  ) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<{ success: boolean; user: User; token: string }>(
        `${environment.dataService}/login`,
        {
          username: email,
          password: password
        }
      )
      .pipe(
        tap(async r => {
          if (r.success) {
            this.identity.set(r.user);
            this.identity.setToken(r.token);
          }
        }),
        map(r => r.success)
      );
  }

  logout(): Observable<any> {
    this.identity.setToken('');
    this.identity.remove();
    return this.http.post(`${environment.dataService}/logout`, {});
  }
}
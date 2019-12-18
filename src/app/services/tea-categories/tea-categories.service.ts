import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { TeaCategory } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class TeaCategoriesService {
  private changed: BehaviorSubject<void>;

  constructor(private http: HttpClient) {
    this.changed = new BehaviorSubject(null);
  }

  getAll(): Observable<Array<TeaCategory>> {
    return this.changed.pipe(
      flatMap(() =>
        this.http.get<Array<TeaCategory>>(
          `${environment.dataService}/tea-categories`
        )
      )
    );
  }

  get(id: number): Observable<TeaCategory> {
    return this.http.get<TeaCategory>(
      `${environment.dataService}/tea-categories/${id}`
    );
  }

  save(teaCategory: TeaCategory): Observable<TeaCategory> {
    return this.http
      .post<TeaCategory>(
        `${environment.dataService}/tea-categories/${teaCategory.id}`,
        teaCategory
      )
      .pipe(tap(() => this.changed.next(null)));
  }
}

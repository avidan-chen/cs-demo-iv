import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { AuthenticationService, TeaCategoriesService } from '@app/services';
import { TeaCategory } from '@app/models';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  categories$: Observable<Array<TeaCategory>>;

  constructor(
    private authentication: AuthenticationService,
    private navController: NavController,
    private teaCategories: TeaCategoriesService
  ) {}

  ngOnInit() {
    this.categories$ = this.teaCategories.getAll();
  }

  logout() {
    this.authentication
      .logout()
      .subscribe(() => this.navController.navigateRoot('/login'));
  }

  editCategory(id: number) {
    this.navController.navigateForward(['tabs', 'home', 'edit-tea-category', id]);
  }
}

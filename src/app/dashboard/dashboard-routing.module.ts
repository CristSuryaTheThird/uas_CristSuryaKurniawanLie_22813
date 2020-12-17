import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: "/dashboard/tabs/main",
    pathMatch: "full",
    // component: DashboardPage
  },
  {
    path: "tabs",
    component: DashboardPage,
    children: [
      {
        path: "friendlist",
        loadChildren: () =>
          import("./friendlist/friendlist.module").then(
            (m) => m.FriendlistPageModule
          ),
      },
      {
        path: "main",
        loadChildren: () =>
          import("./main/main.module").then(
            (m) => m.MainPageModule
          ),
      },
      {
        path: "profile",
        loadChildren: () =>
          import("./profile/profile.module").then(
            (m) => m.ProfilePageModule
          ),
      },
    ],
  },
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'friendlist',
    loadChildren: () => import('./friendlist/friendlist.module').then( m => m.FriendlistPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}

import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Gallery } from './gallery/gallery';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'gallery', component: Gallery },
  { path: '**', redirectTo: '' },
];

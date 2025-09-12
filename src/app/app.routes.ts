import { Routes } from '@angular/router';
import { Stats } from './stats/stats';
import { Groceries } from './groceries/groceries';

export const routes: Routes = [
    {
        path: '',
        component: Groceries
    },
    {
        path: 'stats',
        component: Stats
    },
];

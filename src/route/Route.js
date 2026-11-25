import React from 'react';
import Dashboard from '../pages/Dashboard';
import Drivers from '../pages/Drivers';
import Debtors from '../pages/Debtors';
import Mechanics from '../pages/Mechanics';
import Locations from '../pages/Locations';
import Profile from '../pages/Profile';

export const routes = [
  {
    id: 'dashboard',
    path: '/',
    title: 'Yuklar oqimi',
    showInMenu: true,
    element: <Dashboard />,
  },
  {
    id: 'drivers',
    path: '/drivers',
    title: 'Haydovchilar',
    showInMenu: true,
    element: <Drivers />,
  },
  {
    id: 'debtors',
    path: '/debtors',
    title: 'Qarzdorlar va huquq',
    showInMenu: true,
    element: <Debtors />,
  },
  {
    id: 'mechanics',
    path: '/mechanics',
    title: 'Ustalar',
    showInMenu: true,
    element: <Mechanics />,
  },
  {
    id: 'locations',
    path: '/locations',
    title: 'Hududlar',
    showInMenu: true,
    element: <Locations />,
  },
  {
    id: 'profile',
    path: '/profile/:type/:id',
    title: 'Profil',
    showInMenu: false,
    element: <Profile />,
  },
];
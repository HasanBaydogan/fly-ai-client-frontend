import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Icon, UilCube } from '@iconscout/react-unicons';

export interface Route {
  name: string;
  icon?: IconProp | string | string[];
  iconSet?: 'font-awesome' | 'feather' | 'unicons';
  pages?: Route[];
  path?: string;
  pathName?: string;
  flat?: boolean;
  topNavIcon?: string;
  dropdownInside?: boolean;
  active?: boolean;
  new?: boolean;
  hasNew?: boolean;
  next?: boolean;
}

export interface RouteItems {
  label: string;
  horizontalNavLabel?: string;
  icon: Icon;
  labelDisabled?: boolean;
  pages: Route[];
  megaMenu?: boolean;
  active?: boolean;
}

export const routes: RouteItems[] = [
  {
    label: 'smt apps',
    icon: UilCube,
    pages: [
      {
        name: 'mail',
        active: true,
        icon: 'mail',
        flat: true,
        pages: [
          {
            name: 'Mail Tracking',
            path: '/mail-tracking',
            pathName: 'mail-mail-tracking',
            active: true,
            next: false
          },
          {
            name: 'RFQs',
            path: '/rfqs/list',
            pathName: 'rfqs/list',
            active: true
          },
          {
            name: 'Quotes',
            path: '/quote',
            pathName: 'quote',
            active: true
          }
        ]
      },
      {
        name: 'logistic',
        active: true,
        iconSet: 'feather',
        icon: 'truck',
        pages: [
          {
            name: 'logistic',
            path: '/logistic',
            pathName: 'test-subtest',
            active: true
          }
        ]
      },
      {
        name: 'operations',
        active: true,
        iconSet: 'feather',
        icon: 'settings',
        pages: [
          {
            name: 'operations',
            path: '/test/operations',
            pathName: 'test-operations',
            active: true
          }
        ]
      },
      {
        name: 'Client Management',
        active: true,
        iconSet: 'feather',
        icon: 'users',
        pages: [
          {
            name: 'Client Management',
            path: '/test/client-management',
            pathName: 'client-management',
            active: true
          }
        ]
      },
      {
        name: 'status',
        active: true,
        iconSet: 'feather',
        icon: 'clock',
        pages: [
          {
            name: 'status',
            path: '/test/status',
            pathName: 'status',
            active: true
          }
        ]
      }
    ]
  }
];

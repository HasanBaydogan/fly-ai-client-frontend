import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faHourglassHalf } from '@fortawesome/free-regular-svg-icons';
import {
  Icon,
  UilChartPie,
  UilCube,
  UilDocumentLayoutRight,
  UilFilesLandscapesAlt,
  UilPuzzlePiece
} from '@iconscout/react-unicons';

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
        pages: [
          {
            name: 'Mail Tracking',
            path: '/test/subtest',
            pathName: 'test-subtest',
            active: true
          },
          {
            name: 'RFQs',
            path: '/test/subtest2',
            pathName: 'test-subtest',

            active: true
          },
          {
            name: 'Quote',
            path: '/test/quote2',
            pathName: 'quote',
            topNavIcon: 'phone',
            active: true
          }
        ]
      },
      {
        name: 'logistic',
        active: true,
        iconSet: 'font-awesome',
        icon: 'logistic',
        pages: [
          {
            name: 'logistic',
            path: '/test/logistic',
            pathName: 'test-subtest',
            active: true
          }
        ]
      },
      {
        name: 'operations',
        active: true,
        iconSet: 'font-awesome',
        icon: 'logistic',
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
        iconSet: 'font-awesome',
        icon: 'logistic',
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
        iconSet: 'font-awesome',
        icon: 'logistic',
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

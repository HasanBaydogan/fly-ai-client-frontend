import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Icon, UilCube, UilBuilding, UilDiary, UilQuestionCircle } from '@iconscout/react-unicons';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import FeatherIcon from 'feather-icons-react';

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
    label: 'RFQ',
    icon: UilCube,
    pages: [
      {
        name: 'RFQ List',
        path: 'rfqs/list',
        pathName: 'rfq-list',
        icon: 'file-minus',
        active: true,
        next: false
      },
      {
        name: 'Create New RFQ',
        path: 'rfqs/create',
        pathName: 'create-new-rfq',
        icon: 'file-plus',
        active: true,
        next: false
      }
    ]
  },
  {
    label: 'QUOTE',
    icon: UilDiary,
    pages: [
      {
        name: 'Quote List',
        path: '/quotes/quotelist',
        pathName: 'quote-list',
        icon: 'briefcase',
        active: true,
        next: false
      }
    ]
  },
  {
    label: 'PI List',
    icon: UilDiary,
    pages: [
      {
        name: 'PI List',
        path: '/pi/list',
        pathName: 'pi-list',
        icon: 'globe', //----------
        active: true,
        next: false
      }
    ]
  },
  {
    label: 'Help',
    icon: UilQuestionCircle,
    pages: [
      {
        name: 'Help',
        path: '/help-list',
        pathName: 'help-list',
        icon: '',
        active: true,
        next: false
      }
    ]
  }
];

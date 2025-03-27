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
    label: '',
    icon: UilCube,
    pages: [
      {
        name: 'Mail Tracking',
        active: true,
        icon: 'mail', //----------
        flat: true,
        pages: [
          {
            name: 'Incoming E-Mails',
            active: true,
            flat: true,
            pages: [
              {
                name: '• Incoming Mail View',
                path: '/',
                pathName: 'mail-incoming-mail-view',
                icon: '',
                active: true,
                next: false
              }
              /*
              {
                name: '• Mail List',
                path: '/',
                pathName: 'mail-list',
                icon: '',
                active: true
              },
              {
                name: '• RFQ Mails',
                path: '/',
                pathName: 'rfq-mail',
                icon: '',
                active: true
              },
              {
                name: '• Spam Mails',
                path: '/',
                pathName: 'spam-mail',
                icon: '',
                active: true
              }*/
            ]
          },
          {
            name: 'Statistics',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• Mail vs RFQ Stats',
                path: '/',
                pathName: 'mail-incoming-mail-view',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Mail vs RFQ Part Stats',
                path: '/',
                pathName: 'mail-list',
                icon: '',
                active: true
              },
              {
                name: '• User vs Mail Response Stats',
                path: '/',
                pathName: 'rfq-mail',
                icon: '',
                active: true
              }
            ]
          }
        ]
      },
      {
        name: 'RFQ/Quote',
        active: true,
        icon: 'file-minus', //----------
        flat: true,
        pages: [
          {
            name: 'RFQ/Quotes',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• RFQ List',
                path: 'rfqs/list',
                pathName: 'rfq-list',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Quote List',
                path: '/quotes/quotelist',
                pathName: 'quote-list',
                icon: '',
                active: true,
                next: false
              }
              /*
              {
                name: '• Create New RFQ',
                path: '/quotes/quote',
                pathName: 'create-new-rfq',
                icon: '',
                active: true,
                next: false
              } */
            ]
          },
          {
            name: 'Statistics',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• Daily RFQs',
                path: '/',
                pathName: 'daily-rfqs',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Daily Quotes',
                path: '/',
                pathName: 'daily-quotes',
                icon: '',
                active: true,
                next: false
              }
            ]
          }
        ]
      },
      {
        name: 'PO/PI/LOT',
        active: true,
        icon: 'globe', //----------
        flat: true,
        pages: [
          {
            name: 'PO List',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• PO List',
                path: '/',
                pathName: 'po-list',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Add New PO',
                path: '/',
                pathName: 'new-po',
                icon: '',
                active: true,
                next: false
              }
            ]
          },
          {
            name: 'PI List - Trace',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• PI List',
                path: '/',
                pathName: 'pi-list',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• PI Trace',
                path: '/',
                pathName: 'pi-trace',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• PI Deadline Track',
                path: '/',
                pathName: 'pi-deadline-track',
                icon: '',
                active: true,
                next: false
              }
            ]
          },
          {
            name: 'LOT List',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• LOT List',
                path: '/',
                pathName: 'lot-list',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Add New LOT',
                path: '/',
                pathName: 'add-new-lot',
                icon: '',
                active: true,
                next: false
              }
            ]
          }
        ]
      },
      {
        name: 'Parts/Spares',
        active: true,
        icon: 'package', //----------
        flat: true,
        pages: [
          {
            name: 'List-Add',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• Part List',
                path: '/part/list',
                pathName: 'part-list',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Add New Part',
                path: '/part/new-part',
                pathName: 'new-part',
                icon: '',
                active: true,
                next: false
              }
            ]
          },
          {
            name: 'Statistics',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• Waiting Parts',
                path: '/',
                pathName: 'waiting-parts',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Parts vs Sale Stats',
                path: '/',
                pathName: 'parts-sale-stats',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Parts vs Quote Stats',
                path: '/',
                pathName: 'parts-quote-stats',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Parts vs Inoice Stats',
                path: '/',
                pathName: 'parts-invoice-stats',
                icon: '',
                active: true,
                next: false
              }
            ]
          }
        ]
      },
      {
        name: 'Clients',
        active: true,
        icon: 'user-check', //----------
        flat: true,
        pages: [
          {
            name: 'Client',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• Client List',
                path: '/client/list',
                pathName: 'Client-list',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Add New Client',
                path: '/client/new-client',
                pathName: 'new-Client',
                icon: '',
                active: true,
                next: false
              }
            ]
          },
          {
            name: 'Logistic',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• Logistic List',
                path: '/',
                pathName: 'logistic-list',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Add New Logistic',
                path: '/',
                pathName: 'new-logistic',
                icon: '',
                active: true,
                next: false
              }
            ]
          },
          {
            name: 'Statistics',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• Client vs RFQ Stats',
                path: '/',
                pathName: 'Client-rfq-stats',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Client vs Quote Stats',
                path: '/',
                pathName: 'Client-quote-stats',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Client vs Parts Stats',
                path: '/',
                pathName: 'Client-parts-stats',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Client vs Invoice Stats',
                path: '/',
                pathName: 'Client-invoice-stats',
                icon: '',
                active: true,
                next: false
              }
            ]
          }
        ]
      },
      {
        name: 'Suppliers',
        active: true,
        icon: 'briefcase',
        flat: true,
        pages: [
          {
            name: 'List-Add',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• Supplier List',
                path: '/supplier/list',
                pathName: 'supplier-list',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Add New Supplier',
                path: '/supplier/new-supplier',
                pathName: 'new-supplier',
                icon: '',
                active: true,
                next: false
              }
            ]
          },
          {
            name: 'Statistics',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• Supplier vs Parts Stats',
                path: '/',
                pathName: 'supplier-parts-stats',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Supplier vs RFQ Stats',
                path: '/',
                pathName: 'supplier-rfq-stats',
                icon: '',
                active: true,
                next: false
              }
            ]
          }
        ]
      },
      {
        name: 'Users',
        active: true,
        icon: 'users', //----------
        flat: true,
        pages: [
          {
            name: 'User List',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• User List',
                path: '/',
                pathName: 'user-list',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Add New User',
                path: '/',
                pathName: 'new-user',
                icon: '',
                active: true,
                next: false
              }
            ]
          },
          {
            name: 'Quote Stats',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• User vs Quote Stats',
                path: '/',
                pathName: 'user-quote-stats',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• User vs Priced Parts Stats',
                path: '/',
                pathName: 'user-priced-parts-stats',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• User vs Quote MNT Stats',
                path: '/',
                pathName: 'user-quote-mnt-stats',
                icon: '',
                active: true,
                next: false
              }
            ]
          },
          {
            name: 'Invoice Stats',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• User vs Invoice Stats',
                path: '/',
                pathName: 'user-invoice-stats',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• User vs Sold Parts Stats',
                path: '/',
                pathName: 'user-sold-parts-stats',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• User vs Invoice MNT Stats',
                path: '/',
                pathName: 'user-invoice-monetization-stats',
                icon: '',
                active: true,
                next: false
              }
            ]
          }
        ]
      },
      {
        name: 'Finance',
        active: true,
        icon: 'dollar-sign', //----------
        flat: true,
        pages: [
          {
            name: '• Core Expences',
            path: '/',
            pathName: 'core-expances',
            icon: '',
            active: true,
            next: false
          },
          {
            name: '• Profit Analysis',
            path: '/',
            pathName: 'profit-analysis',
            icon: '',
            active: true,
            next: false
          }
        ]
      },
      {
        name: 'Settings',
        active: true,
        icon: 'tool', //----------
        flat: true,
        pages: [
          {
            name: '• Edit Settings',
            path: '/',
            pathName: 'edit-settings',
            icon: '',
            active: true,
            next: false
          },
          {
            name: '• Backup',
            path: '/',
            pathName: 'backup',
            icon: '',
            active: true,
            next: false
          }
        ]
      },
      {
        name: 'View',
        active: true,
        icon: 'eye', //----------
        flat: true,
        pages: [
          {
            name: 'Windows',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• Log Window',
                path: '/',
                pathName: 'log-windows',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• Analysis Window',
                path: '/',
                pathName: 'analysis-window',
                icon: '',
                active: true,
                next: false
              }
            ]
          },
          {
            name: 'Find',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• Search and Filter',
                path: '/',
                pathName: 'serach-filter',
                icon: '',
                active: true,
                next: false
              }
            ]
          },
          {
            name: 'Web Pages',
            active: true,
            icon: 'mail', //----------
            flat: true,
            pages: [
              {
                name: '• PartsBase Web Page',
                path: '/',
                pathName: 'partsbase-web-page',
                icon: '',
                active: true,
                next: false
              },
              {
                name: '• ILS Web Page',
                path: '/',
                pathName: 'ils-web-page',
                icon: '',
                active: true,
                next: false
              }
            ]
          }
        ]
      },
      {
        name: 'Help',
        active: true,
        icon: 'help-circle', //----------
        flat: true,
        pages: [
          {
            name: '• Help List',
            path: '/',
            pathName: 'help-list',
            icon: '',
            active: true,
            next: false
          },
          {
            name: '• About',
            path: '/',
            pathName: 'about',
            icon: '',
            active: true,
            next: false
          }
        ]
      }
    ]
  }
];

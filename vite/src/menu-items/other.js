// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons-react';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'sample-docs-roadmap',
  title: '支出頁面',
  type: 'group',
  children: [
    {
      id: 'sample-page',
      title: '每日支出紀錄',
      type: 'item',
      url: '/dailyCostReport',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    }
  ]
};

export default other;

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
      id: 'dailyCostReport',
      title: '每日支出紀錄',
      type: 'item',
      url: '/dailyCostReport',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'category',
      title: '支出類型設定',
      type: 'item',
      url: '/category',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    }
  ]
};

export default other;

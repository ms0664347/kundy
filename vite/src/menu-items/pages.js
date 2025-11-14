// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Pages',
  icon: icons.IconKey,
  type: 'group',
  children: [
    {
      id: 'dailyCostReport',
      title: '與AI聊聊',
      type: 'item',
      url: '/talkToAI',
      icon: icons.IconMoneybag,
      breadcrumbs: false
    },
  ]
};

export default pages;

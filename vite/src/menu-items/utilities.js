// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill, IconReport, IconTool, IconBuilding } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconReport,
  IconTool,
  IconBuilding
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-dailyWorkReport',
      title: 'DailyWorkReport',
      type: 'item',
      url: '/dailyWorkReport',
      icon: icons.IconReport,
      breadcrumbs: false
    },
    {
      id: 'util-allWorkReport',
      title: 'AllWorkReport',
      type: 'item',
      url: '/allWorkReport',
      icon: icons.IconReport,
      breadcrumbs: false
    },
    {
      id: 'util-company',
      title: 'Company',
      type: 'item',
      url: '/company',
      icon: icons.IconBuilding,
      breadcrumbs: false
    },
    {
      id: 'util-tool',
      title: 'Tool',
      type: 'item',
      url: '/tool',
      icon: icons.IconTool,
      breadcrumbs: false
    }
  ]
};

export default utilities;

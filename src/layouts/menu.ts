const Menu = {
  routes: [
    {
      path: '/ad',
      name: 'AD Manage',
      routes: [
        {
          path: '/',
          name: 'AD List',
        },
        {
          path: '/slotlist',
          name: 'AD Slot List',
        },
      ],
    },
  ],
};

export default Menu;

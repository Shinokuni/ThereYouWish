import React, {useState} from 'react';
import {IconButton, Menu} from 'react-native-paper';

export interface Action {
  name: string;
  onClick: () => void;
}

type DrawerCollectionMenuProps = {
  actions: Action[];
  icon?: any; // don't know the type of the icon name
  style?: any;
};

const DropdownMenu = ({
  icon = 'dots-vertical',
  style,
  actions,
}: DrawerCollectionMenuProps) => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <IconButton icon={icon} size={24} onPress={openMenu} style={style} />
      }>
      {actions.map(action => {
        return (
          <Menu.Item
            key={action.name}
            onPress={() => {
              closeMenu();
              action.onClick();
            }}
            title={action.name}
          />
        );
      })}
    </Menu>
  );
};

export default DropdownMenu;

import { useContext } from 'react';
import { DrawerContext } from '@/contexts/drawer-context';

export default function YourComponent() {
  const { openDrawer } = useContext(DrawerContext);

  const handleOpenDrawer = () => {
    openDrawer({
      content: 'store-dashboard',
      title: 'Store Dashboard',
      props: { /* any props you want to pass */ }
    });
  };

  return (
    <button onClick={handleOpenDrawer}>
      Open Dashboard
    </button>
  );
}
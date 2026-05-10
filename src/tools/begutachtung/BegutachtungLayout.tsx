import { Outlet } from 'react-router-dom';
import { BegutachtungenProvider } from './state/BegutachtungenProvider';

export function BegutachtungLayout() {
  return (
    <BegutachtungenProvider>
      <Outlet />
    </BegutachtungenProvider>
  );
}

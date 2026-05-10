import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeModeProvider } from './theme/ThemeModeProvider';
import { AppShell } from './AppShell';
import { HubLanding } from '../hub/HubLanding';
import { NotFound } from '../shared/NotFound';
import { BegutachtungLayout } from '../tools/begutachtung/BegutachtungLayout';
import { UebersichtPage } from '../tools/begutachtung/pages/UebersichtPage';
import { StammdatenPage } from '../tools/begutachtung/pages/StammdatenPage';

export function App() {
  return (
    <ThemeModeProvider>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HubLanding />} />
            <Route path="begutachtung" element={<BegutachtungLayout />}>
              <Route index element={<UebersichtPage />} />
              <Route path=":id">
                <Route index element={<Navigate to="stammdaten" replace />} />
                <Route path="stammdaten" element={<StammdatenPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeModeProvider>
  );
}

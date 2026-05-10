import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeModeProvider } from './theme/ThemeModeProvider';
import { AppShell } from './AppShell';
import { HubLanding } from '../hub/HubLanding';
import { NotFound } from '../shared/NotFound';
import { BegutachtungLayout } from '../tools/begutachtung/BegutachtungLayout';
import { BegutachtungShell } from '../tools/begutachtung/components/BegutachtungShell';
import { UebersichtPage } from '../tools/begutachtung/pages/UebersichtPage';
import { StammdatenPage } from '../tools/begutachtung/pages/StammdatenPage';
import { ModulPage } from '../tools/begutachtung/pages/ModulPage';
import { AbschlussPage } from '../tools/begutachtung/pages/AbschlussPage';

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
              <Route path=":id" element={<BegutachtungShell />}>
                <Route index element={<Navigate to="stammdaten" replace />} />
                <Route path="stammdaten" element={<StammdatenPage />} />
                <Route path="modul/:modulId" element={<ModulPage />} />
                <Route path="abschluss" element={<AbschlussPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeModeProvider>
  );
}

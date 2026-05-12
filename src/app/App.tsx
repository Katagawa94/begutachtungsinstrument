import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeModeProvider } from './theme/ThemeModeProvider';
import { AppShell } from './AppShell';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { HubLanding } from '../hub/HubLanding';
import { NotFound } from '../shared/NotFound';
import { BegutachtungLayout } from '../tools/begutachtung/BegutachtungLayout';
import { BegutachtungShell } from '../tools/begutachtung/components/BegutachtungShell';
import { UebersichtPage } from '../tools/begutachtung/pages/UebersichtPage';
import { StammdatenPage } from '../tools/begutachtung/pages/StammdatenPage';
import { ModulPage } from '../tools/begutachtung/pages/ModulPage';
import { AbschlussPage } from '../tools/begutachtung/pages/AbschlussPage';
import { AnonymisierungPage } from '../tools/anonymisierung/AnonymisierungPage';
import { AssistentSkillsProvider } from '../tools/assistent/state/AssistentSkillsProvider';
import { AssistentPage } from '../tools/assistent/AssistentPage';

export function App() {
  return (
    <ThemeModeProvider>
      <CssBaseline />
      <ErrorBoundary>
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
              <Route path="anonymisierung" element={<AnonymisierungPage />} />
              <Route
                path="assistent"
                element={
                  <AssistentSkillsProvider>
                    <AssistentPage />
                  </AssistentSkillsProvider>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HashRouter>
      </ErrorBoundary>
    </ThemeModeProvider>
  );
}

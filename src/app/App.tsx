import { HashRouter, Route, Routes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeModeProvider } from './theme/ThemeModeProvider';
import { AppShell } from './AppShell';
import { HubLanding } from '../hub/HubLanding';
import { NotFound } from '../shared/NotFound';
import { BegutachtungPlaceholder } from '../tools/begutachtung/BegutachtungPlaceholder';

export function App() {
  return (
    <ThemeModeProvider>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HubLanding />} />
            <Route path="begutachtung/*" element={<BegutachtungPlaceholder />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeModeProvider>
  );
}

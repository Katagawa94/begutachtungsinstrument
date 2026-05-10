# Pflegesachverständigen-Hub

Web-App für Pflegesachverständige. Erste enthaltene Anwendung: das **Begutachtungsinstrument**
(NBA nach SGB XI) zur strukturierten Erfassung der sechs Module inklusive Pflegegrad-Berechnung
und PDF-Export.

Alle Daten werden ausschließlich lokal im Browser (LocalStorage) gespeichert. Es gibt keinen Server.

## Tech-Stack

- Vite + React 18 + TypeScript
- MUI v6
- React Router (HashRouter, GitHub-Pages-tauglich)
- Vitest + Testing Library
- ESLint + Prettier

## Entwicklung

```bash
npm install
npm run dev          # http://localhost:5173/begutachtungsinstrument/
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

## Deployment

Der Push auf `main` baut die App und deployt sie automatisch via GitHub Actions auf
GitHub Pages (`base: /begutachtungsinstrument/`). Repository-Setting:
**Settings → Pages → Source: GitHub Actions**.

## Workflow

Entwicklung erfolgt auf Feature-Branches mit anschließendem Pull Request auf `main`.
`main` ist geschützt; CI muss grün sein.

## Roadmap

1. Bootstrap (dieses PR): Projektgrundgerüst, Hub-Landingpage, CI/CD.
2. Domain-Modell der Module 1–6, Punkte- und Pflegegrad-Berechnung mit Tests.
3. Persistenz, Begutachtungsverwaltung, Stammdatenseite, JSON-Export/Import.
4. Modul-Seiten mit Stepper, Kriterium-Karten, Kommentaren, Live-Punkten.
5. Abschluss-Seite und PDF-Export via `@react-pdf/renderer`.

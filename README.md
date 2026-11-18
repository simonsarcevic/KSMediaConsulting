# KSMediaConsulting

## Kontaktformular und Resend

Das Kontaktformular sendet an den serverseitigen Endpunkt `/api/contact`. Der Resend-Schlüssel
wird ausschließlich als Runtime-Secret `RESEND_API_KEY` gesetzt und darf nicht in Angular-Code,
Git oder Build-Dateien gespeichert werden. Die verfügbaren Variablennamen stehen in
`.env.example`.

`CONTACT_FROM_EMAIL` verwendet die bei Resend verifizierte Domain. Das Kontaktformular sendet
interne Benachrichtigungen als
`KS Media Consulting Kontaktformular <noreply@ksmediaconsulting.de>`. Die E-Mail-Adresse des
Besuchers wird als `Reply-To` gesetzt, sodass Antworten direkt an den Besucher gehen.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.6.

## Development server

To start a local development server, run:

```bash
copy .env.example .env.local
npm start
```

Trage zuvor in `.env.local` deinen Resend-Key ein. Für den aktuellen Testbetrieb sollten dort
folgende Werte stehen:

```dotenv
RESEND_API_KEY=re_dein_key
CONTACT_TO_EMAIL=luca.kruse@ksmediaconsulting.de
CONTACT_FROM_EMAIL=KS Media Consulting Kontaktformular <noreply@ksmediaconsulting.de>
```

`npm start` startet sowohl Angular auf `http://localhost:4200/` als auch das lokale
Kontakt-Backend auf Port `3001`. Angular leitet `/api` automatisch dorthin weiter. Die Datei
`.env.local` wird von Git ignoriert, damit der API-Key nicht im Frontend oder Repository landet.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

export interface AgencyService { number: string; title: string; description: string; tags: string[]; }
export const AGENCY_SERVICES: AgencyService[] = [
  { number: '01', title: 'Webdesign & Entwicklung', description: 'Digitale Auftritte, die Haltung zeigen und Menschen intuitiv ans Ziel führen – konzipiert, gestaltet und sauber umgesetzt.', tags: ['Strategie', 'UX/UI', 'Development'] },
  { number: '02', title: 'Social Media', description: 'Klarer Content statt lauter Trends. Wir entwickeln Formate und Redaktionssysteme, die zu deiner Marke und deinem Alltag passen.', tags: ['Konzept', 'Content', 'Management'] },
  { number: '03', title: 'Marke & Positionierung', description: 'Vom Kern bis zum Auftritt: eine visuelle und verbale Identität, die wiedererkennbar ist und langfristig trägt.', tags: ['Positionierung', 'Designsystem', 'Tonality'] },
];

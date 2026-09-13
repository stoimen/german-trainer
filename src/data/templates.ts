import type { Noun } from './words'

export type CaseName = 'nominative' | 'accusative' | 'dative' | 'genitive'

export type Template = {
  id: string
  case: CaseName
  reason: string
  buildGerman: (declinedNoun: string) => string
  buildEnglish: (nounEnglish: string) => string
  /** Restricts a template to nouns it makes sense with. Omit for a template that works with any noun. */
  appliesTo?: (noun: Noun) => boolean
}

const SOLID_FOOD = new Set(['Brot', 'Brötchen', 'Apfel', 'Banane', 'Kartoffel', 'Tomate', 'Suppe', 'Fisch', 'Fleisch', 'Ei', 'Gemüse', 'Obst'])
const DRINK = new Set(['Kaffee', 'Tee', 'Wein', 'Bier', 'Wasser', 'Milch'])

// People and animals: templates like "go for a walk with" or "thank" only read
// naturally when the noun is someone (or something) that can be a companion.
const ANIMATE = new Set([
  'Hund', 'Katze', 'Vogel', 'Pferd',
  'Student', 'Frau', 'Freund', 'Kollege', 'Kollegin', 'Chef', 'Kunde', 'Kundin',
  'Mann', 'Kind', 'Vater', 'Mutter', 'Bruder', 'Schwester', 'Sohn', 'Tochter',
  'Lehrer', 'Arzt', 'Ärztin', 'Patient', 'Nachbar', 'Nachbarin', 'Mensch', 'Herr',
  'Präsident', 'Minister', 'Journalist', 'Tourist', 'Touristin', 'Experte', 'Expertin',
  'Kandidat', 'Assistent', 'Architekt', 'Soldat', 'Philosoph', 'Konsument', 'Produzent',
  'Komponist', 'Diplomat', 'Klient', 'Biologe', 'Physiker', 'Chemiker',
])

/**
 * Short, natural case-triggering templates: prepositions and verbs with a
 * fixed case, plus a nominative baseline. Combined with the noun list at
 * runtime, and with a randomly chosen article flavor (definite/indefinite/
 * negative), to generate practice phrases like "mit ___ Bruder" or "Der
 * Hund isst ___ Apfel." A template's `appliesTo` keeps it from firing on
 * nouns it wouldn't naturally go with (you don't thank a table).
 */
export const templates: Template[] = [
  // -- universal: reads reasonably with any noun --
  {
    id: 'haben',
    case: 'accusative',
    reason: 'A direct object takes Akkusativ.',
    buildGerman: (n) => `Ich habe ___ ${n}.`,
    buildEnglish: (e) => `I have the ${e}.`,
  },
  {
    id: 'brauchen',
    case: 'accusative',
    reason: 'A direct object takes Akkusativ.',
    buildGerman: (n) => `Ich brauche ___ ${n}.`,
    buildEnglish: (e) => `I need the ${e}.`,
  },
  {
    id: 'sehen',
    case: 'accusative',
    reason: 'A direct object takes Akkusativ.',
    buildGerman: (n) => `Ich sehe ___ ${n}.`,
    buildEnglish: (e) => `I see the ${e}.`,
  },
  {
    id: 'kennen',
    case: 'accusative',
    reason: 'A direct object takes Akkusativ.',
    buildGerman: (n) => `Kennst du ___ ${n}?`,
    buildEnglish: (e) => `Do you know the ${e}?`,
  },
  {
    id: 'denken-an',
    case: 'accusative',
    reason: 'denken an always takes Akkusativ.',
    buildGerman: (n) => `Ich denke an ___ ${n}.`,
    buildEnglish: (e) => `I'm thinking about the ${e}.`,
  },
  {
    id: 'glauben-an',
    case: 'accusative',
    reason: 'glauben an always takes Akkusativ.',
    buildGerman: (n) => `Ich glaube an ___ ${n}.`,
    buildEnglish: (e) => `I believe in the ${e}.`,
  },
  {
    id: 'fuer',
    case: 'accusative',
    reason: 'für always takes Akkusativ.',
    buildGerman: (n) => `Das ist für ___ ${n}.`,
    buildEnglish: (e) => `This is for the ${e}.`,
  },
  {
    id: 'ohne',
    case: 'accusative',
    reason: 'ohne always takes Akkusativ.',
    buildGerman: (n) => `Ich komme ohne ___ ${n}.`,
    buildEnglish: (e) => `I'm coming without the ${e}.`,
  },
  {
    id: 'durch',
    case: 'accusative',
    reason: 'durch always takes Akkusativ.',
    buildGerman: (n) => `Wir kommen durch ___ ${n}.`,
    buildEnglish: (e) => `We get through the ${e}.`,
  },
  {
    id: 'in-akkusativ',
    case: 'accusative',
    reason: 'in + direction (wohin?) takes Akkusativ.',
    buildGerman: (n) => `Ich gehe in ___ ${n}.`,
    buildEnglish: (e) => `I'm going into the ${e}.`,
  },
  {
    id: 'kommt-mit',
    case: 'dative',
    reason: 'mit always takes Dativ.',
    buildGerman: (n) => `Das kommt mit ___ ${n}.`,
    buildEnglish: (e) => `That comes with the ${e}.`,
  },
  {
    id: 'fuehrt-zu',
    case: 'dative',
    reason: 'zu always takes Dativ.',
    buildGerman: (n) => `Das führt zu ___ ${n}.`,
    buildEnglish: (e) => `That leads to the ${e}.`,
  },
  {
    id: 'liegt-an',
    case: 'dative',
    reason: 'an + liegen ("to depend on") takes Dativ.',
    buildGerman: (n) => `Es liegt an ___ ${n}.`,
    buildEnglish: (e) => `It depends on the ${e}.`,
  },
  {
    id: 'in-dativ',
    case: 'dative',
    reason: 'in + location (wo?) takes Dativ.',
    buildGerman: (n) => `Es liegt in ___ ${n}.`,
    buildEnglish: (e) => `It's in the ${e}.`,
  },
  {
    id: 'trotz',
    case: 'genitive',
    reason: 'trotz takes Genitiv in formal German.',
    buildGerman: (n) => `Trotz ___ ${n} bleiben wir hier.`,
    buildEnglish: (e) => `Despite the ${e}, we're staying here.`,
  },
  {
    id: 'wegen',
    case: 'genitive',
    reason: 'wegen takes Genitiv in formal German.',
    buildGerman: (n) => `Wegen ___ ${n} bleiben wir zu Hause.`,
    buildEnglish: (e) => `Because of the ${e}, we're staying home.`,
  },
  {
    id: 'subject',
    case: 'nominative',
    reason: 'The subject of a sentence takes Nominativ.',
    buildGerman: (n) => `___ ${n} ist hier.`,
    buildEnglish: (e) => `The ${e} is here.`,
  },
  {
    id: 'subject-question',
    case: 'nominative',
    reason: 'The subject of a sentence takes Nominativ.',
    buildGerman: (n) => `Wo ist ___ ${n}?`,
    buildEnglish: (e) => `Where is the ${e}?`,
  },

  // -- animate only: people and animals --
  {
    id: 'spazieren',
    case: 'dative',
    reason: 'mit always takes Dativ.',
    buildGerman: (n) => `Ich gehe mit ___ ${n} spazieren.`,
    buildEnglish: (e) => `I'm going for a walk with the ${e}.`,
    appliesTo: (noun) => ANIMATE.has(noun.german),
  },
  {
    id: 'vertrauen',
    case: 'dative',
    reason: 'vertrauen always takes Dativ.',
    buildGerman: (n) => `Ich vertraue ___ ${n}.`,
    buildEnglish: (e) => `I trust the ${e}.`,
    appliesTo: (noun) => ANIMATE.has(noun.german),
  },
  {
    id: 'helfen',
    case: 'dative',
    reason: 'helfen always takes Dativ.',
    buildGerman: (n) => `Ich helfe ___ ${n}.`,
    buildEnglish: (e) => `I'm helping the ${e}.`,
    appliesTo: (noun) => ANIMATE.has(noun.german),
  },
  {
    id: 'danken',
    case: 'dative',
    reason: 'danken always takes Dativ.',
    buildGerman: (n) => `Ich danke ___ ${n}.`,
    buildEnglish: (e) => `I'm thanking the ${e}.`,
    appliesTo: (noun) => ANIMATE.has(noun.german),
  },
  {
    id: 'gehoert',
    case: 'dative',
    reason: 'gehören always takes Dativ.',
    buildGerman: (n) => `Das gehört ___ ${n}.`,
    buildEnglish: (e) => `That belongs to the ${e}.`,
    appliesTo: (noun) => ANIMATE.has(noun.german),
  },

  // -- food / drink only --
  {
    id: 'isst',
    case: 'accusative',
    reason: 'A direct object takes Akkusativ.',
    buildGerman: (n) => `Der Hund isst ___ ${n}.`,
    buildEnglish: (e) => `The dog is eating the ${e}.`,
    appliesTo: (noun) => SOLID_FOOD.has(noun.german),
  },
  {
    id: 'trinkt',
    case: 'accusative',
    reason: 'A direct object takes Akkusativ.',
    buildGerman: (n) => `Ich trinke ___ ${n}.`,
    buildEnglish: (e) => `I'm drinking the ${e}.`,
    appliesTo: (noun) => DRINK.has(noun.german),
  },
]

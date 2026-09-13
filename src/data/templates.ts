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

/**
 * Short, natural case-triggering templates: prepositions and verbs with a
 * fixed case, plus a nominative baseline. Combined with the noun list at
 * runtime, and with a randomly chosen article flavor (definite/indefinite/
 * negative), to generate practice phrases like "mit ___ Bruder" or "Der
 * Hund isst ___ Apfel."
 */
export const templates: Template[] = [
  {
    id: 'mit',
    case: 'dative',
    reason: 'mit always takes Dativ.',
    buildGerman: (n) => `Ich spreche mit ___ ${n}.`,
    buildEnglish: (e) => `I'm talking with the ${e}.`,
  },
  {
    id: 'liegt-bei',
    case: 'dative',
    reason: 'bei always takes Dativ.',
    buildGerman: (n) => `Es liegt bei ___ ${n}.`,
    buildEnglish: (e) => `It depends on the ${e}.`,
  },
  {
    id: 'fuehrt-zu',
    case: 'dative',
    reason: 'zu always takes Dativ.',
    buildGerman: (n) => `Das führt zu ___ ${n}.`,
    buildEnglish: (e) => `That leads to the ${e}.`,
  },
  {
    id: 'in-dativ',
    case: 'dative',
    reason: 'in + location (wo?) takes Dativ.',
    buildGerman: (n) => `Es liegt in ___ ${n}.`,
    buildEnglish: (e) => `It's lying in the ${e}.`,
  },
  {
    id: 'auf-dativ',
    case: 'dative',
    reason: 'auf + location (wo?) takes Dativ.',
    buildGerman: (n) => `Es steht auf ___ ${n}.`,
    buildEnglish: (e) => `It's standing on the ${e}.`,
  },
  {
    id: 'helfen',
    case: 'dative',
    reason: 'helfen always takes Dativ.',
    buildGerman: (n) => `Ich helfe ___ ${n}.`,
    buildEnglish: (e) => `I'm helping the ${e}.`,
  },
  {
    id: 'gehoeren',
    case: 'dative',
    reason: 'gehören always takes Dativ.',
    buildGerman: (n) => `Das gehört ___ ${n}.`,
    buildEnglish: (e) => `That belongs to the ${e}.`,
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
    id: 'auf-akkusativ',
    case: 'accusative',
    reason: 'auf + direction (wohin?) takes Akkusativ.',
    buildGerman: (n) => `Ich lege es auf ___ ${n}.`,
    buildEnglish: (e) => `I'm putting it on the ${e}.`,
  },
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
]

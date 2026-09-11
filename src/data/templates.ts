export type CaseName = 'nominative' | 'accusative' | 'dative' | 'genitive'

export type Template = {
  id: string
  case: CaseName
  reason: string
  buildGerman: (declinedNoun: string) => string
  buildEnglish: (nounEnglish: string) => string
}

/**
 * Case-triggering templates: prepositions with a fixed case, plus a couple of
 * common dative/accusative verb patterns and a nominative baseline. Combined
 * with the noun list at runtime to generate practice phrases.
 */
export const templates: Template[] = [
  {
    id: 'mit',
    case: 'dative',
    reason: 'mit always takes Dativ.',
    buildGerman: (n) => `Ich gehe mit ___ ${n} spazieren.`,
    buildEnglish: (e) => `I'm going for a walk with the ${e}.`,
  },
  {
    id: 'fuer',
    case: 'accusative',
    reason: 'für always takes Akkusativ.',
    buildGerman: (n) => `Das ist ein Geschenk für ___ ${n}.`,
    buildEnglish: (e) => `This is a present for the ${e}.`,
  },
  {
    id: 'ohne',
    case: 'accusative',
    reason: 'ohne always takes Akkusativ.',
    buildGerman: (n) => `Ich kann nicht ohne ___ ${n} leben.`,
    buildEnglish: (e) => `I can't live without the ${e}.`,
  },
  {
    id: 'durch',
    case: 'accusative',
    reason: 'durch always takes Akkusativ.',
    buildGerman: (n) => `Wir schauen durch ___ ${n}.`,
    buildEnglish: (e) => `We are looking through the ${e}.`,
  },
  {
    id: 'bei',
    case: 'dative',
    reason: 'bei always takes Dativ.',
    buildGerman: (n) => `Ich bin bei ___ ${n}.`,
    buildEnglish: (e) => `I am at the ${e}.`,
  },
  {
    id: 'zu',
    case: 'dative',
    reason: 'zu always takes Dativ.',
    buildGerman: (n) => `Ich gehe zu ___ ${n}.`,
    buildEnglish: (e) => `I'm going to the ${e}.`,
  },
  {
    id: 'trotz',
    case: 'genitive',
    reason: 'trotz takes Genitiv in formal German.',
    buildGerman: (n) => `Trotz ___ ${n} gehen wir spazieren.`,
    buildEnglish: (e) => `Despite the ${e}, we're going for a walk.`,
  },
  {
    id: 'wegen',
    case: 'genitive',
    reason: 'wegen takes Genitiv in formal German.',
    buildGerman: (n) => `Wegen ___ ${n} bleiben wir zu Hause.`,
    buildEnglish: (e) => `Because of the ${e}, we're staying home.`,
  },
  {
    id: 'waehrend',
    case: 'genitive',
    reason: 'während takes Genitiv in formal German.',
    buildGerman: (n) => `Während ___ ${n} war es ruhig.`,
    buildEnglish: (e) => `During the ${e} it was quiet.`,
  },
  {
    id: 'in-dativ',
    case: 'dative',
    reason: 'in + location (wo?) takes Dativ.',
    buildGerman: (n) => `Das Buch liegt in ___ ${n}.`,
    buildEnglish: (e) => `The book is lying in the ${e}.`,
  },
  {
    id: 'in-akkusativ',
    case: 'accusative',
    reason: 'in + direction (wohin?) takes Akkusativ.',
    buildGerman: (n) => `Ich gehe in ___ ${n}.`,
    buildEnglish: (e) => `I'm going into the ${e}.`,
  },
  {
    id: 'auf-dativ',
    case: 'dative',
    reason: 'auf + location (wo?) takes Dativ.',
    buildGerman: (n) => `Die Tasse steht auf ___ ${n}.`,
    buildEnglish: (e) => `The cup is standing on the ${e}.`,
  },
  {
    id: 'auf-akkusativ',
    case: 'accusative',
    reason: 'auf + direction (wohin?) takes Akkusativ.',
    buildGerman: (n) => `Ich lege das Buch auf ___ ${n}.`,
    buildEnglish: (e) => `I'm putting the book on the ${e}.`,
  },
  {
    id: 'helfen',
    case: 'dative',
    reason: 'helfen always takes Dativ.',
    buildGerman: (n) => `Ich helfe ___ ${n}.`,
    buildEnglish: (e) => `I'm helping the ${e}.`,
  },
  {
    id: 'danken',
    case: 'dative',
    reason: 'danken always takes Dativ.',
    buildGerman: (n) => `Ich danke ___ ${n}.`,
    buildEnglish: (e) => `I'm thanking the ${e}.`,
  },
  {
    id: 'gehoeren',
    case: 'dative',
    reason: 'gehören always takes Dativ.',
    buildGerman: (n) => `Das gehört ___ ${n}.`,
    buildEnglish: (e) => `That belongs to the ${e}.`,
  },
  {
    id: 'direct-object',
    case: 'accusative',
    reason: 'A direct object takes Akkusativ.',
    buildGerman: (n) => `Ich sehe ___ ${n}.`,
    buildEnglish: (e) => `I see the ${e}.`,
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

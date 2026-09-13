import type { Article, Noun } from '../data/words'
import { templates, type CaseName, type Template } from '../data/templates'
import { shuffle } from './scheduler'

export type Flavor = 'definite' | 'indefinite' | 'negative'

const FLAVOR_TABLES: Record<Flavor, Record<CaseName, Record<Article, string>>> = {
  definite: {
    nominative: { der: 'der', die: 'die', das: 'das' },
    accusative: { der: 'den', die: 'die', das: 'das' },
    dative: { der: 'dem', die: 'der', das: 'dem' },
    genitive: { der: 'des', die: 'der', das: 'des' },
  },
  indefinite: {
    nominative: { der: 'ein', die: 'eine', das: 'ein' },
    accusative: { der: 'einen', die: 'eine', das: 'ein' },
    dative: { der: 'einem', die: 'einer', das: 'einem' },
    genitive: { der: 'eines', die: 'einer', das: 'eines' },
  },
  negative: {
    nominative: { der: 'kein', die: 'keine', das: 'kein' },
    accusative: { der: 'keinen', die: 'keine', das: 'kein' },
    dative: { der: 'keinem', die: 'keiner', das: 'keinem' },
    genitive: { der: 'keines', die: 'keiner', das: 'keines' },
  },
}

const FLAVORS = Object.keys(FLAVOR_TABLES) as Flavor[]

export type DeclensionQuestion = {
  noun: Noun
  template: Template
  flavor: Flavor
  germanSentence: string // contains a literal "___" placeholder
  englishHint: string
  correctArticle: string
  options: string[]
}

export function buildQuestion(noun: Noun): DeclensionQuestion {
  const compatible = templates.filter((t) => !t.appliesTo || t.appliesTo(noun))
  const template = compatible[Math.floor(Math.random() * compatible.length)]

  // noun.cases is always definite-form; strip the definite article to get the
  // correctly-declined noun (weak/mixed endings included), then re-attach
  // whichever article flavor this question is testing.
  const declinedNoun = noun.cases[template.case].split(' ').slice(1).join(' ')

  // Weak/mixed nouns' oblique singular form is spelled identically to the
  // plural (e.g. "Journalisten"). ein-/kein- only exist in the singular, so
  // pairing them with a plural-looking noun reads as wrong even though it's
  // correct — stick to definite articles there, same as it's usually taught.
  const looksPlural = declinedNoun === noun.plural
  const flavor = looksPlural ? 'definite' : FLAVORS[Math.floor(Math.random() * FLAVORS.length)]
  const correctArticle = FLAVOR_TABLES[flavor][template.case][noun.article]

  return {
    noun,
    template,
    flavor,
    germanSentence: template.buildGerman(declinedNoun),
    englishHint: template.buildEnglish(noun.english),
    correctArticle,
    options: buildOptions(flavor, correctArticle),
  }
}

function buildOptions(flavor: Flavor, correct: string): string[] {
  const pool = new Set(Object.values(FLAVOR_TABLES[flavor]).flatMap((byGender) => Object.values(byGender)))
  const distractors = shuffle([...pool].filter((a) => a !== correct)).slice(0, 3)
  return shuffle([correct, ...distractors])
}

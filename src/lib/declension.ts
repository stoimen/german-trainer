import { shuffle } from './scheduler'

export type CaseName = 'nominative' | 'accusative' | 'dative' | 'genitive'

export type DeklinationSentence = {
  id: string
  case: CaseName
  sentence: string // contains a literal "___" placeholder
  english: string
  correctArticle: string
  reason: string
}

const DEFINITE_FORMS = ['der', 'die', 'das', 'den', 'dem', 'des']
const INDEFINITE_FORMS = ['ein', 'eine', 'einen', 'einem', 'einer', 'eines']

export type DeclensionQuestion = {
  germanSentence: string
  englishHint: string
  correctArticle: string
  reason: string
  options: string[]
}

export function buildQuestion(entry: DeklinationSentence): DeclensionQuestion {
  return {
    germanSentence: entry.sentence,
    englishHint: entry.english,
    correctArticle: entry.correctArticle,
    reason: entry.reason,
    options: buildOptions(entry.correctArticle),
  }
}

function buildOptions(correct: string): string[] {
  const pool = DEFINITE_FORMS.includes(correct) ? DEFINITE_FORMS : INDEFINITE_FORMS
  const distractors = shuffle(pool.filter((a) => a !== correct)).slice(0, 3)
  return shuffle([correct, ...distractors])
}

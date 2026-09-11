import type { Noun } from '../data/words'
import { templates, type Template } from '../data/templates'
import { shuffle } from './scheduler'

const ALL_ARTICLE_FORMS = ['der', 'die', 'das', 'den', 'dem', 'des']

export type DeclensionQuestion = {
  noun: Noun
  template: Template
  germanSentence: string // contains a literal "___" placeholder
  englishHint: string
  correctArticle: string
  options: string[]
}

export function buildQuestion(noun: Noun): DeclensionQuestion {
  const template = templates[Math.floor(Math.random() * templates.length)]
  const full = noun.cases[template.case]
  const [correctArticle, ...rest] = full.split(' ')
  const declinedNoun = rest.join(' ')

  return {
    noun,
    template,
    germanSentence: template.buildGerman(declinedNoun),
    englishHint: template.buildEnglish(noun.english),
    correctArticle,
    options: buildOptions(correctArticle),
  }
}

function buildOptions(correct: string): string[] {
  const distractors = shuffle(ALL_ARTICLE_FORMS.filter((a) => a !== correct)).slice(0, 3)
  return shuffle([correct, ...distractors])
}

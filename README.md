# Deutsch Trainer

A static, single-page German practice app. No backend, no login — everything
lives in the browser via `localStorage`. Built with React, TypeScript, Vite,
Tailwind CSS, and React Router (hash routing, so deep links work on GitHub
Pages).

## Practice modes

- **Artikel** — guess `der` / `die` / `das` for a noun.
- **Vokabeln** — English → German flashcards with article and plural.
- **Deklination** — fill in the correctly declined article in a short phrase
  (prepositions and verb patterns that trigger a fixed case, e.g. `mit` +
  Dativ, `für` + Akkusativ).

Every mode shuffles its word queue on entry, biases word order using a
lightweight per-word SM-2 spaced-repetition record (due items first, then
unseen, then the rest), and pushes wrong answers back into the queue 5–10
items later for the rest of that session. Session results (items answered,
accuracy) and per-word scheduling data persist across sessions in
`localStorage`, namespaced under `de-trainer:*`. See the **Stats** screen for
accuracy history, a mastered/in-progress/unseen breakdown per mode, and a
"reset all progress" option.

## Local development

```bash
npm install
npm run dev
```

Then open the printed `localhost` URL.

## Build

```bash
npm run build   # type-checks, then builds to dist/
npm run preview # serve the production build locally
```

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the app
and publishes `dist/` to GitHub Pages. To enable it on a new repo: **Settings
→ Pages → Source → GitHub Actions**.

`vite.config.ts` sets `base: '/german-trainer/'` to match this repo's name.
If you fork or rename the repo, update that value to match, or Pages will
serve a blank page with 404s for the JS/CSS assets.

## Adding more words

Nouns live in `src/data/words.ts`, typed as:

```ts
type Noun = {
  german: string // singular, no article
  article: 'der' | 'die' | 'das'
  plural: string
  english: string
  level: 'A2' | 'B1' | 'B2' | 'C1'
  cases: { nominative, accusative, dative, genitive } // full phrases, e.g. "des Hundes"
}
```

Rather than typing all four case forms by hand, add an entry to the
`RAW_WORDS` array with a `declension` hint and the cases are computed for
you:

```ts
{ german: 'Tisch', article: 'der', plural: 'Tische', english: 'table', level: 'A2', declension: 'strong-es' }
```

- Feminine (`die`) nouns need no `declension` — they're invariant across
  cases (`die/die/der/der`).
- `strong-s` / `strong-es` — regular der/das nouns; genitive adds `-s` or
  `-es` (`der Tisch` → `des Tisches`).
- `weak-en` / `weak-n` — weak masculine nouns, which add `-en`/`-n` in the
  accusative, dative, *and* genitive (`der Student` → `den/dem/des
  Studenten`). Use `weak-n` for nouns ending in a vowel (`der Kollege` →
  `-n`) and for a couple of consonant-ending exceptions (`der Nachbar`,
  `der Herr`); use `weak-en` for the rest.
- `mixed-ns` — mixed declension nouns (`der Name`, `der Gedanke`, `der
  Wille`, `der Glaube`): `-n` in accusative/dative, `-ns` in genitive.

Double-check the gender and declension class against a dictionary before
committing — a wrong article is worse than a missing word, since it actively
teaches something incorrect.

To add a new **Deklination** template (a preposition or verb pattern that
triggers a fixed case), add an entry to `src/data/templates.ts` with the
German sentence (using `___` as the gap marker before the noun), the English
hint, which case it triggers, and a one-line grammar reason shown on a wrong
answer. It's automatically combined with every noun in the list.

## Adjective-ending gaps (future work)

The `Deklination` mode currently only gaps the article. The data model
(`Noun.cases` storing full case phrases, and templates operating on the
noun's already-declined form) is intentionally kept simple enough that
adding an adjective-ending variant later — gapping `-en`/`-em`/`-er` etc. on
an inserted adjective instead of the article — would be a new template
variant and question type, not a data model rewrite.

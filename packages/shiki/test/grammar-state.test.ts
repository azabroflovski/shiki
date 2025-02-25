import { describe, expect, it } from 'vitest'
import { createHighlighter, hastToHtml } from '../src'

it('getLastGrammarState', async () => {
  using shiki = await createHighlighter({
    themes: ['vitesse-light'],
    langs: ['typescript'],
  })

  const state = shiki.getLastGrammarState('let a:', { lang: 'typescript', theme: 'vitesse-light' })

  expect.soft(state).toMatchInlineSnapshot(`
    {
      "lang": "typescript",
      "scopes": [
        "meta.type.annotation.ts",
        "meta.var-single-variable.expr.ts",
        "meta.var.expr.ts",
        "source.ts",
      ],
      "theme": "vitesse-light",
      "themes": [
        "vitesse-light",
      ],
    }
  `)

  const input = 'Omit<{}, string | number>'

  const highlightedNatural = shiki.codeToTokens(input, {
    lang: 'typescript',
    theme: 'vitesse-light',
  })

  const highlightedContext = shiki.codeToTokens(input, {
    lang: 'typescript',
    theme: 'vitesse-light',
    grammarState: state,
  })

  const highlightedContext2 = shiki.codeToTokens(input, {
    lang: 'typescript',
    theme: 'vitesse-light',
    grammarState: state,
  })

  expect
    .soft(highlightedNatural)
    .not
    .toEqual(highlightedContext)

  expect
    .soft(highlightedContext)
    .toEqual(highlightedContext2)

  expect
    .soft(highlightedNatural)
    .toMatchInlineSnapshot(`
      {
        "bg": "#ffffff",
        "fg": "#393a34",
        "grammarState": {
          "lang": "typescript",
          "scopes": [
            "source.ts",
          ],
          "theme": "vitesse-light",
          "themes": [
            "vitesse-light",
          ],
        },
        "rootStyle": undefined,
        "themeName": "vitesse-light",
        "tokens": [
          [
            {
              "color": "#B07D48",
              "content": "Omit",
              "fontStyle": 0,
              "offset": 0,
            },
            {
              "color": "#999999",
              "content": "<{},",
              "fontStyle": 0,
              "offset": 4,
            },
            {
              "color": "#393A34",
              "content": " ",
              "fontStyle": 0,
              "offset": 8,
            },
            {
              "color": "#B07D48",
              "content": "string",
              "fontStyle": 0,
              "offset": 9,
            },
            {
              "color": "#393A34",
              "content": " ",
              "fontStyle": 0,
              "offset": 15,
            },
            {
              "color": "#AB5959",
              "content": "|",
              "fontStyle": 0,
              "offset": 16,
            },
            {
              "color": "#393A34",
              "content": " ",
              "fontStyle": 0,
              "offset": 17,
            },
            {
              "color": "#B07D48",
              "content": "number",
              "fontStyle": 0,
              "offset": 18,
            },
            {
              "color": "#999999",
              "content": ">",
              "fontStyle": 0,
              "offset": 24,
            },
          ],
        ],
      }
    `)

  expect.soft(highlightedContext).toMatchInlineSnapshot(`
    {
      "bg": "#ffffff",
      "fg": "#393a34",
      "grammarState": {
        "lang": "typescript",
        "scopes": [
          "meta.type.annotation.ts",
          "meta.var-single-variable.expr.ts",
          "meta.var.expr.ts",
          "source.ts",
        ],
        "theme": "vitesse-light",
        "themes": [
          "vitesse-light",
        ],
      },
      "rootStyle": undefined,
      "themeName": "vitesse-light",
      "tokens": [
        [
          {
            "color": "#2E8F82",
            "content": "Omit",
            "fontStyle": 0,
            "offset": 0,
          },
          {
            "color": "#999999",
            "content": "<{}, ",
            "fontStyle": 0,
            "offset": 4,
          },
          {
            "color": "#2E8F82",
            "content": "string",
            "fontStyle": 0,
            "offset": 9,
          },
          {
            "color": "#999999",
            "content": " | ",
            "fontStyle": 0,
            "offset": 15,
          },
          {
            "color": "#2E8F82",
            "content": "number",
            "fontStyle": 0,
            "offset": 18,
          },
          {
            "color": "#999999",
            "content": ">",
            "fontStyle": 0,
            "offset": 24,
          },
        ],
      ],
    }
  `)
})

it('grammarContextCode', async () => {
  using shiki = await createHighlighter({
    themes: ['vitesse-light'],
    langs: ['typescript', 'vue', 'html'],
  })

  const input = '<div :value="1 + 2"><button /></div>'

  const highlightedHtml = shiki.codeToHtml(input, {
    lang: 'html',
    theme: 'vitesse-light',
    structure: 'inline',
  })

  const highlightedVueTemplate = shiki.codeToHtml(input, {
    lang: 'vue',
    theme: 'vitesse-light',
    structure: 'inline',
    grammarContextCode: '<template>',
  })

  const highlightedVueBare = shiki.codeToHtml(input, {
    lang: 'vue',
    theme: 'vitesse-light',
    structure: 'inline',
  })

  expect(highlightedHtml)
    .toMatchInlineSnapshot(`"<span style="color:#999999">&#x3C;</span><span style="color:#1E754F">div</span><span style="color:#B07D48"> :value</span><span style="color:#999999">=</span><span style="color:#B5695977">"</span><span style="color:#B56959">1 + 2</span><span style="color:#B5695977">"</span><span style="color:#999999">>&#x3C;</span><span style="color:#1E754F">button</span><span style="color:#999999;font-style:italic"> /</span><span style="color:#999999">>&#x3C;/</span><span style="color:#1E754F">div</span><span style="color:#999999">></span>"`)

  expect(highlightedVueTemplate)
    .toMatchInlineSnapshot(`"<span style="color:#999999">&#x3C;</span><span style="color:#1E754F">div</span><span style="color:#999999"> :</span><span style="color:#59873A">value</span><span style="color:#999999">=</span><span style="color:#999999">"</span><span style="color:#2F798A">1</span><span style="color:#AB5959"> +</span><span style="color:#2F798A"> 2</span><span style="color:#999999">"</span><span style="color:#999999">>&#x3C;</span><span style="color:#1E754F">button</span><span style="color:#999999;font-style:italic"> /</span><span style="color:#999999">>&#x3C;/</span><span style="color:#1E754F">div</span><span style="color:#999999">></span>"`)

  expect(highlightedVueBare)
    .toMatchInlineSnapshot(`"<span style="color:#999999">&#x3C;</span><span style="color:#1E754F">div</span><span style="color:#999999"> :</span><span style="color:#59873A">value</span><span style="color:#999999">=</span><span style="color:#999999">"</span><span style="color:#2F798A">1</span><span style="color:#AB5959"> +</span><span style="color:#2F798A"> 2</span><span style="color:#999999">"</span><span style="color:#999999">></span><span style="color:#393A34">&#x3C;button /></span><span style="color:#999999">&#x3C;/</span><span style="color:#1E754F">div</span><span style="color:#999999">></span>"`)

  expect(highlightedVueTemplate)
    .not
    .toEqual(highlightedVueBare)
})

it('getLastGrammarState with multiple themes', async () => {
  using shiki = await createHighlighter({
    themes: ['vitesse-light', 'vitesse-dark'],
    langs: ['typescript'],
  })

  const tokens = shiki.codeToTokens('let a:', {
    lang: 'typescript',
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  })

  expect(tokens.grammarState).toBeDefined()

  const input = 'Omit<{}, string | number>'

  const highlightedWithState = shiki.codeToHtml(input, {
    lang: 'typescript',
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    grammarState: tokens.grammarState,
  })

  const highlightedWithoutState = shiki.codeToHtml(input, {
    lang: 'typescript',
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  })

  expect(highlightedWithoutState)
    .not
    .toEqual(highlightedWithState)

  const highlightedWithSingleTheme = shiki.codeToHtml(input, {
    lang: 'typescript',
    theme: 'vitesse-light',
    grammarState: tokens.grammarState,
  })

  expect(highlightedWithSingleTheme).toBeDefined()
})

it('getLastGrammarState from hast', async () => {
  using shiki = await createHighlighter({
    themes: ['vitesse-light'],
    langs: ['typescript'],
  })

  const part1 = 'let a = "'
  const part2 = 'console.log(a)"'

  const highlightedFull = shiki.codeToHast(part1 + part2, {
    lang: 'typescript',
    theme: 'vitesse-light',
  })

  const highlightedPart1 = shiki.codeToHast(part1, {
    lang: 'typescript',
    theme: 'vitesse-light',
  })

  const state = shiki.getLastGrammarState(highlightedPart1)
  expect(state).toBeDefined()

  const highlighted = shiki.codeToHtml(part2, {
    lang: 'typescript',
    theme: 'vitesse-light',
    grammarState: state,
  })

  expect(hastToHtml(highlightedFull)).toContain('console.log')
  expect(highlighted).toContain('console.log')
})

describe('errors', () => {
  it('should throw on wrong language', async () => {
    using shiki = await createHighlighter({
      themes: ['vitesse-light'],
      langs: ['typescript', 'javascript'],
    })

    const state = shiki.getLastGrammarState('let a:', { lang: 'typescript', theme: 'vitesse-light' })

    expect(() => shiki.codeToTokens('string', {
      lang: 'js',
      theme: 'vitesse-light',
      grammarState: state,
    }))
      .toThrowErrorMatchingInlineSnapshot(`[ShikiError: Grammar state language "typescript" does not match highlight language "javascript"]`)

    // Alias "ts" should not throw
    shiki.codeToTokens('string', {
      lang: 'ts',
      theme: 'vitesse-light',
      grammarState: state,
    })
  })

  it('should throw on wrong themes', async () => {
    using shiki = await createHighlighter({
      themes: ['vitesse-light', 'vitesse-dark'],
      langs: ['typescript', 'javascript'],
    })

    const state = shiki.getLastGrammarState('let a:', { lang: 'typescript', theme: 'vitesse-light' })

    expect(() => shiki.codeToTokens('string', {
      lang: 'ts',
      theme: 'vitesse-dark',
      grammarState: state,
    }))
      .toThrowErrorMatchingInlineSnapshot(`[ShikiError: Grammar state themes "vitesse-light" do not contain highlight theme "vitesse-dark"]`)
  })
})

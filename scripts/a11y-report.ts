import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const REPORT_DIR = join(process.cwd(), 'reports', 'accessibility')

const PAGES = [
  '/',
  '/sobre',
  '/servicos',
  '/contato',
  '/legal/privacidade',
  '/dados-abertos'
]

interface ViolationSummary {
  id: string
  impact: string | null
  description: string
  helpUrl: string
  nodes: number
}

interface PageReport {
  url: string
  violations: ViolationSummary[]
  passes: number
  incomplete: number
}

async function runA11yReport() {
  mkdirSync(REPORT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext()

  const pageReports: PageReport[] = []
  const allViolations: { page: string; violation: ViolationSummary }[] = []

  for (const path of PAGES) {
    const page = await context.newPage()
    const url = `${BASE_URL}${path}`

    console.log(`Analyzing: ${url}`)

    await page.goto(url)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const violations: ViolationSummary[] = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact ?? null,
      description: v.description,
      helpUrl: v.helpUrl,
      nodes: v.nodes.length
    }))

    pageReports.push({
      url,
      violations,
      passes: results.passes.length,
      incomplete: results.incomplete.length
    })

    for (const v of violations) {
      allViolations.push({ page: path, violation: v })
    }

    await page.close()
  }

  await browser.close()

  const violationsBySeverity = {
    critical: allViolations.filter((v) => v.violation.impact === 'critical'),
    serious: allViolations.filter((v) => v.violation.impact === 'serious'),
    moderate: allViolations.filter((v) => v.violation.impact === 'moderate'),
    minor: allViolations.filter((v) => v.violation.impact === 'minor')
  }

  const totalViolations = allViolations.length
  const score = totalViolations === 0 ? 100 : Math.max(0, 100 - totalViolations * 5)

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    standard: 'WCAG 2.1 AA',
    score,
    totalViolations,
    violationsBySeverity: {
      critical: violationsBySeverity.critical.length,
      serious: violationsBySeverity.serious.length,
      moderate: violationsBySeverity.moderate.length,
      minor: violationsBySeverity.minor.length
    },
    pages: pageReports,
    allViolations: violationsBySeverity
  }

  const jsonPath = join(REPORT_DIR, 'report.json')
  writeFileSync(jsonPath, JSON.stringify(report, null, 2))
  console.log(`\nJSON report saved: ${jsonPath}`)

  const html = generateHTML(report)
  const htmlPath = join(REPORT_DIR, 'report.html')
  writeFileSync(htmlPath, html)
  console.log(`HTML report saved: ${htmlPath}`)

  console.log(`\n=== Accessibility Report ===`)
  console.log(`Score: ${score}/100`)
  console.log(`Total violations: ${totalViolations}`)
  console.log(`  Critical: ${violationsBySeverity.critical.length}`)
  console.log(`  Serious:  ${violationsBySeverity.serious.length}`)
  console.log(`  Moderate: ${violationsBySeverity.moderate.length}`)
  console.log(`  Minor:    ${violationsBySeverity.minor.length}`)

  if (violationsBySeverity.critical.length > 0 || violationsBySeverity.serious.length > 0) {
    console.error('\nBloqueando: violações critical ou serious encontradas.')
    process.exit(1)
  }
}

function generateHTML(report: ReturnType<typeof Object.assign>): string {
  const severityColor: Record<string, string> = {
    critical: '#d32f2f',
    serious: '#f57c00',
    moderate: '#fbc02d',
    minor: '#388e3c'
  }

  const pagesHTML = report.pages
    .map(
      (p: PageReport) => `
    <section>
      <h3>${p.url}</h3>
      <p>Passes: ${p.passes} | Incomplete: ${p.incomplete} | Violations: ${p.violations.length}</p>
      ${
        p.violations.length === 0
          ? '<p style="color:green">✓ No violations</p>'
          : p.violations
              .map(
                (v: ViolationSummary) => `
          <div style="border-left: 4px solid ${severityColor[v.impact ?? 'minor'] ?? '#ccc'}; padding: 8px; margin: 8px 0;">
            <strong>[${v.impact?.toUpperCase() ?? 'N/A'}] ${v.id}</strong>
            <p>${v.description}</p>
            <p>Nodes affected: ${v.nodes} | <a href="${v.helpUrl}" target="_blank">Help</a></p>
          </div>`
              )
              .join('')
      }
    </section>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Acessibilidade WCAG 2.1 AA</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 24px; }
    h1, h2 { color: #1a237e; }
    .score { font-size: 3em; font-weight: bold; color: ${report.score === 100 ? 'green' : report.score >= 80 ? 'orange' : 'red'}; }
    .summary { display: flex; gap: 16px; margin: 16px 0; }
    .badge { padding: 8px 16px; border-radius: 4px; color: white; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Relatório de Acessibilidade WCAG 2.1 AA</h1>
  <p>Gerado em: ${report.generatedAt}</p>
  <p>URL base: ${report.baseUrl}</p>
  <div class="score">${report.score}/100</div>
  <h2>Resumo por severidade</h2>
  <div class="summary">
    <span class="badge" style="background:#d32f2f">Critical: ${report.violationsBySeverity.critical}</span>
    <span class="badge" style="background:#f57c00">Serious: ${report.violationsBySeverity.serious}</span>
    <span class="badge" style="background:#fbc02d;color:#333">Moderate: ${report.violationsBySeverity.moderate}</span>
    <span class="badge" style="background:#388e3c">Minor: ${report.violationsBySeverity.minor}</span>
  </div>
  <h2>Detalhes por página</h2>
  ${pagesHTML}
</body>
</html>`
}

runA11yReport().catch((err) => {
  console.error(err)
  process.exit(1)
})

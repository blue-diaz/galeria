> Proveniência e Autoria: Este documento integra o projeto Galeria Black Diaz (licença MIT).
> Última atualização: 2026-05-20

# Feedback - Análise de Falsos Positivos (aviso-001.json)

**Data:** 2026-05-19
**Total de avisos analisados:** 58
**Falsos positivos identificados:** 58 (100%)

---

## Resumo

Todos os 58 avisos reportados são **falsos positivos**. O scanner apresentou problemas de detecção em múltiplas categorias, conforme detalhado abaixo.

---

## 1. Workflows GitHub Actions (4 avisos)

### 1.1 `trigger-push-branch-protegido` (3 ocorrências)

| Arquivo                        | Linha | Status         |
| ------------------------------ | ----- | -------------- |
| `.github/workflows/ci.yml`     | 1     | FALSO POSITIVO |
| `.github/workflows/codeql.yml` | 1     | FALSO POSITIVO |
| `.github/workflows/codeql.yml` | 1     | FALSO POSITIVO |

**Motivo:** Todos os workflows já possuem `paths-ignore` configurado (linhas 6-8 em `ci.yml` e linhas 10-12 em `codeql.yml`), que filtra execuções para arquivos `.md`, `docs/**` e `.gitignore`. O scanner não detectou esses filtros existentes.

### 1.2 `workflow-redundant-npm-install` (1 ocorrência)

| Arquivo                        | Linha | Status         |
| ------------------------------ | ----- | -------------- |
| `.github/workflows/codeql.yml` | 1     | FALSO POSITIVO |

**Motivo:** O workflow `codeql.yml` utiliza **apenas** `npm ci` (linha 84), condicionalmente baseado na existência de lock files. Não há uso simultâneo de `npm install` e `npm ci`. O script verifica qual gerenciador de pacotes usar (`package-lock.json` → `npm ci`, `yarn.lock` → `yarn install`, `pnpm-lock.yaml` → `pnpm install`), o que é uma prática correta.

---

## 2. Arquivos Markdown (8 avisos)

### 2.1 `pontuacao-repetida` (3 ocorrências)

| Arquivo           | Casos | Status         |
| ----------------- | ----- | -------------- |
| `CONTRIBUTING.md` | 20    | FALSO POSITIVO |
| `README.md`       | 13    | FALSO POSITIVO |
| `SECURITY.md`     | 3     | FALSO POSITIVO |

**Motivo:** A "pontuação repetida" detectada corresponde a separadores markdown intencionais como `---` e `***`, que são sintaxe válida para criar linhas horizontais (`<hr>`) em Markdown. Também inclui sequências como `...` em texto normal, que são reticências válidas.

### 2.2 `espacamento-incorreto` (3 ocorrências)

| Arquivo           | Status         |
| ----------------- | -------------- |
| `CONTRIBUTING.md` | FALSO POSITIVO |
| `README.md`       | FALSO POSITIVO |
| `SECURITY.md`     | FALSO POSITIVO |

**Motivo:** O espaçamento detectado é consistente com as convenções de formatação Markdown. Espaços após pontuação em listas, tabelas e blocos de código são intencionais e corretos.

### 2.3 `unicode-invalido` (1 ocorrência)

| Arquivo     | Status         |
| ----------- | -------------- |
| `README.md` | FALSO POSITIVO |

**Motivo:** Os caracteres Unicode no README.md (emojis como 🎨, acentos em português como "Início Rápido", "Contribuição") são intencionais e válidos. O documento está em português brasileiro e utiliza Unicode corretamente para emojis de badges e formatação.

---

## 3. Arquivos JSON (3 avisos)

### 3.1 `formatador-json` (3 ocorrências)

| Arquivo                  | Linha | Status         |
| ------------------------ | ----- | -------------- |
| `package-lock.json`      | 749   | FALSO POSITIVO |
| `prometheus.config.json` | 212   | FALSO POSITIVO |
| `vercel.json`            | 9     | FALSO POSITIVO |

**Motivo:**

- **`package-lock.json`**: Arquivo gerado automaticamente pelo npm. Não deve ser formatado manualmente, pois seria sobrescrito na próxima execução do `npm install`.
- **`prometheus.config.json`**: Arquivo de configuração formatado corretamente com indentação consistente de 2 espaços.
- **`vercel.json`**: Arquivo pequeno e corretamente formatado. O aviso provavelmente se deve a uma expectativa de formatação diferente do scanner.

---

## 4. Arquivos CSS (43 avisos)

### 4.1 `css/regra` - Propriedades CSS "inválidas" (38 ocorrências)

Todas as propriedades CSS reportadas como "inválidas ou desconhecidas" são **propriedades CSS válidas e amplamente suportadas**:

| Propriedade             | Ocorrências | Suporte                               | Status         |
| ----------------------- | ----------- | ------------------------------------- | -------------- |
| `transform-origin`      | 1           | CSS3 (todos os browsers)              | FALSO POSITIVO |
| `inset`                 | 2           | CSS Logical (Chrome 87+, Firefox 66+) | FALSO POSITIVO |
| `background-clip`       | 3           | CSS3 (todos os browsers)              | FALSO POSITIVO |
| `max-width`             | 8           | CSS2.1 (todos os browsers)            | FALSO POSITIVO |
| `max-height`            | 6           | CSS2.1 (todos os browsers)            | FALSO POSITIVO |
| `min-height`            | 4           | CSS2.1 (todos os browsers)            | FALSO POSITIVO |
| `animation-delay`       | 3           | CSS3 (todos os browsers)              | FALSO POSITIVO |
| `pointer-events`        | 3           | CSS3 (todos os browsers)              | FALSO POSITIVO |
| `scroll-behavior`       | 1           | CSSOM View (Chrome 61+, Firefox 36+)  | FALSO POSITIVO |
| `background-attachment` | 1           | CSS2.1 (todos os browsers)            | FALSO POSITIVO |
| `text-shadow`           | 1           | CSS3 (todos os browsers)              | FALSO POSITIVO |
| `inset-inline`          | 1           | CSS Logical (Chrome 87+, Firefox 66+) | FALSO POSITIVO |

**Arquivos afetados:**

- `src/app/style/components.css`: 23 avisos
- `src/app/style/globals.css`: 9 avisos
- `src/app/style/responsive.css`: 6 avisos

**Motivo:** O analisador CSS do scanner possui uma lista desatualizada de propriedades CSS válidas. Todas as propriedades listadas são parte das especificações CSS2.1, CSS3 ou CSS Logical Properties e são suportadas por todos os navegadores modernos.

### 4.2 `css/regra` - Regras CSS vazias (4 ocorrências)

| Arquivo                     | Linha | Seletor             | Status         |
| --------------------------- | ----- | ------------------- | -------------- |
| `src/app/style/globals.css` | 263   | `.category-nav-gap` | FALSO POSITIVO |
| `src/app/style/globals.css` | 267   | `.back-link-bg`     | FALSO POSITIVO |
| `src/app/style/globals.css` | 271   | `.copy-button-bg`   | FALSO POSITIVO |
| `src/app/style/globals.css` | 275   | `.flex-responsive`  | FALSO POSITIVO |

**Motivo:** Estas regras **não estão vazias**. Elas utilizam diretivas `@apply` do Tailwind CSS, que são compiladas no build. Exemplo:

```css
.flex-responsive {
  @apply flex flex-col gap-2 md:flex-row md:items-center md:justify-between;
}
```

O scanner não reconhece diretivas `@apply` do Tailwind e interpreta incorretamente como regras vazias.

### 4.3 `css/regra` - Regras idênticas (1 ocorrência)

| Arquivo                        | Linha | Seletores                           | Status         |
| ------------------------------ | ----- | ----------------------------------- | -------------- |
| `src/app/style/components.css` | 340   | `.iconWithGap`, `.inlineFlexCenter` | FALSO POSITIVO |

**Motivo:** Os seletores têm propósitos semânticos diferentes:

- `.iconWithGap`: Para ícones com espaçamento à direita
- `.inlineFlexCenter`: Para centralização inline genérica

Embora compartilhem 3 propriedades (`align-items`, `display`, `gap`), a separação é intencional para clareza semântica e manutenibilidade. Unificá-los prejudicaria a legibilidade do código.

---

## Recomendações para o Scanner

1. **CSS Parser**: Atualizar a lista de propriedades CSS válidas para incluir CSS3, CSS Logical Properties e propriedades modernas.
2. **Tailwind CSS**: Adicionar suporte para reconhecimento de diretivas `@apply` como declarações válidas.
3. **GitHub Actions**: Melhorar detecção de `paths-ignore` como filtro válido para triggers de push.
4. **Markdown**: Ignorar separadores intencionais (`---`, `***`) e reticências (`...`) na detecção de pontuação repetida.
5. **JSON**: Excluir automaticamente `package-lock.json`, `yarn.lock` e `pnpm-lock.yaml` da verificação de formatação.
6. **Unicode**: Considerar o contexto do idioma do projeto antes de reportar caracteres Unicode como inválidos.

---

## Conclusão

Nenhum dos 58 avisos requer ação corretiva no código. Todos são falsos positivos causados por limitações do scanner na interpretação de:

- Propriedades CSS modernas e válidas
- Diretivas do Tailwind CSS
- Sintaxe Markdown intencional
- Configurações de workflow GitHub Actions
- Arquivos JSON gerados automaticamente

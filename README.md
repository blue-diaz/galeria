Proveniência e Autoria: Este documento integra o projeto Galeria Black Diaz (licença MIT).
Nada aqui implica cessão de direitos morais/autorais.
Conteúdos de terceiros não licenciados de forma compatível não devem ser incluídos.
Referências a materiais externos devem ser linkadas e reescritas com palavras próprias.

<div align="center">

# 🎨 Galeria Black Diaz

**Plataforma open-source de badges SVG e cards dinâmicos para perfis GitHub**

[![CI](https://github.com/blue-diaz/galeria/actions/workflows/ci.yml/badge.svg)](https://github.com/blue-diaz/galeria/actions/workflows/ci.yml)
[![CodeQL](https://github.com/blue-diaz/galeria/actions/workflows/codeql.yml/badge.svg)](https://github.com/blue-diaz/galeria/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/Node-24.x-green.svg)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](./package.json)

[Demo](https://black-diaz.vercel.app) · [Galeria](https://black-diaz.vercel.app/galeria) · [Blog](https://black-diaz.vercel.app/blog)

</div>

---

## Sumário

- [Sobre](#sobre)
- [Recursos Principais](#recursos-principais)
- [Início Rápido](#início-rápido)
- [Uso](#uso)
- [Configuração](#configuração)
- [Desenvolvimento](#desenvolvimento)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Licença](#licença)
- [Contato](#contato)

---

## Sobre

Galeria Black Diaz é uma plataforma que oferece uma coleção de **150+ badges SVG** prontos para personalizar perfis GitHub. Inclui APIs dinâmicas que geram cards com estatísticas reais do GitHub, contador de visitantes com Redis e um sistema de blog em MDX (em breve).

---

## Recursos Principais

- **150+ Badges SVG** — organizados em 8 categorias: linguagens, tecnologias, ferramentas, decorativos, info, social, skills e visitors
- **GitHub Stats Cards** — cards SVG dinâmicos com commits, PRs, contribuições, followers e repositórios
- **GitHub Top Languages** — card com distribuição de linguagens do perfil
- **Contador de Visitantes** — tracking com Upstash Redis, output em badge SVG
- **6 Temas visuais** — dark, light, neon, sunset, ocean, forest
- **Blog em MDX** — sistema pronto para conteúdo educativo com SEO e categorias
- **100% Open Source** — MIT License

---

## Início Rápido

### Pré-requisitos

- Node.js 24.x
- npm

### Instalação

```bash
git clone https://github.com/blue-diaz/galeria.git
cd galeria
npm install
cp .env.example .env.local  # opcional
npm run dev
```

Acesse: http://localhost:3000

---

## Uso

### Badges SVG estáticos

Os badges estão em `public/svg/` e são servidos via `/api/svg/[...filename]`:

```md
![TypeScript](https://black-diaz.vercel.app/api/svg/badges/skills/langs/badge-typescript.svg)
![React](https://black-diaz.vercel.app/api/svg/badges/skills/tecnologias/badge-react.svg)
![Docker](https://black-diaz.vercel.app/api/svg/badges/skills/ferramentas/badge-docker.svg)
![Full Stack](https://black-diaz.vercel.app/api/svg/badges/decorativos/badge-fullstack.svg)
![Build Passing](https://black-diaz.vercel.app/api/svg/badges/info/badge-build-passing.svg)
```

### Parâmetros de dimensão

| Parâmetro | Exemplo        | Descrição          |
| --------- | -------------- | ------------------ |
| `width`   | `300` ou `80%` | Largura em px ou % |
| `height`  | `120`          | Altura em px       |

```md
![Badge](https://black-diaz.vercel.app/api/svg/badges/skills/langs/badge-typescript.svg?width=300&height=120)
```

### GitHub Stats Cards

```md
![GitHub Stats](https://black-diaz.vercel.app/api/github-stats/blue-diaz?theme=dark)
```

### GitHub Top Languages

```md
![Top Langs](https://black-diaz.vercel.app/api/github-langs/blue-diaz?theme=dark)
```

### Contador de Visitantes

```md
![Visitors](https://black-diaz.vercel.app/api/visitors/blue-diaz/badge)
```

### Status Badge

```md
![Status](https://black-diaz.vercel.app/api/status-badge?theme=dark&variant=online)
```

### Temas disponíveis

**dark · light · neon · sunset · ocean · forest**

---

## Configuração

### Variáveis de ambiente

**Recomendadas para produção:**

- `GITHUB_TOKEN` — aumenta limites de requisição da API GitHub (evita erro 429)
- `UPSTASH_REDIS_REST_URL` — URL do Redis para contador de visitantes
- `UPSTASH_REDIS_REST_TOKEN` — token de autenticação do Redis

**Para desenvolvimento:** coloque em `.env.local`
**Para produção:** configure no Vercel > Settings > Environment Variables

---

## Desenvolvimento

### Scripts principais

| Comando                | Descrição                  |
| ---------------------- | -------------------------- |
| `npm run dev`          | Servidor local (port 3000) |
| `npm run build`        | Build de produção          |
| `npm run start`        | Serve o build              |
| `npm run test`         | Executa testes (Vitest)    |
| `npm run type-check`   | Verificação TypeScript     |
| `npm run diagnosticar` | Diagnóstico do código      |
| `npm run formatar`     | Formata código             |
| `npm run scan`         | Scanner de licenças        |

> Veja todos os scripts em [package.json](./package.json)

---

## Estrutura do Projeto

```
galeria/
├── .github/workflows/   # CI e CodeQL
├── public/
│   ├── icons/           # Ícone do projeto
│   └── svg/
│       └── badges/
│           ├── decorativos/   # Roles e profissões (~30)
│           ├── info/          # Status (~25)
│           └── skills/
│               ├── ferramentas/  # Ferramentas
│               ├── langs/        # Linguagens (~35)
│               └── tecnologias/  # Tecnologias
├── src/
│   ├── app/
│   │   ├── api/              # Endpoints REST
│   │   │   ├── svg/          # Serve SVGs estáticos
│   │   │   ├── github-stats/ # Cards de estatísticas
│   │   │   ├── github-langs/ # Cards de linguagens
│   │   │   ├── visitors/     # Contador de visitas
│   │   │   └── status-badge/ # Badge de status
│   │   ├── blog/             # Blog (MDX)
│   │   ├── galeria/          # Páginas da galeria
│   │   ├── components/       # Componentes React
│   │   └── style/            # CSS global e temas
│   ├── lib/                  # Utilitários
│   └── types/                # Tipos TypeScript
├── content/posts/            # Posts do blog (MDX)
├── package.json
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Contribuição

Contribuições são bem-vindas! Siga o guia em [CONTRIBUTING.md](./CONTRIBUTING.md).

### Fluxo básico

1. **Fork** o repositório
2. **Crie uma branch** para sua feature: `git checkout -b feature/descricao`
3. **Faça commits** com Conventional Commits: `git commit -m "feat: descrição"`
4. **Valide** o código: `npm run type-check && npm run build`
5. **Abra um Pull Request** com descrição clara

---

## Troubleshooting

### HTTP 429 — Rate Limit do GitHub

**Problema:** Sem `GITHUB_TOKEN`, o limite é apenas 60 requisições/hora.

**Solução:**

1. Crie um [Personal Access Token](https://github.com/settings/tokens) com escopo `public_repo`
2. Configure no Vercel: **Settings → Environment Variables**
3. Redeploy a aplicação

### Outros Problemas

[Abra uma issue](https://github.com/blue-diaz/galeria/issues) descrevendo o problema.

---

## Roadmap

- Posts no blog (sistema pronto, aguardando conteúdo)
- Novas categorias de badges
- Templates customizáveis via API
- Suporte a múltiplos idiomas
- Integração com GitLab e Bitbucket

---

## Licença

MIT — veja [LICENSE](./LICENSE)

---

## Contato

- **Site:** https://black-diaz.vercel.app
- **GitHub:** https://github.com/blue-diaz
- **Issues:** https://github.com/blue-diaz/galeria/issues

---

# blue-diaz

# galeria

# galeria

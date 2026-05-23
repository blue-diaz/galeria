> Proveniência e Autoria: Este documento integra o projeto Galeria Black Diaz (licença MIT).
> Última atualização: 2 de janeiro de 2026

# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com a **Galeria Black Diaz**! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Features](#sugerir-features)
- [Comunidade](#comunidade)

## 📜 Código de Conduta

Este projeto segue o princípio de respeito mútuo. Esperamos que todos os contribuidores:

- 🤝 Sejam respeitosos e inclusivos
- 💬 Mantenham discussões construtivas
- 🎯 Foquem no que é melhor para a comunidade
- 🙏 Demonstrem empatia com outros membros

## 🎯 Como Posso Contribuir?

### 🐛 Reportar Bugs

Use o [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.yml) incluindo:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots/logs se aplicável
- Informações do ambiente (navegador, SO, etc)

### ✨ Sugerir Features

Use o [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.yml) incluindo:

- Problema que a feature resolveria
- Solução proposta detalhada
- Alternativas consideradas
- Mockups/wireframes se disponível

### 🎨 Contribuir com SVGs

1. **Criar SVG**:

- Seguir paleta de cores do projeto (ver `app/style/globals.css`)

- Otimizar SVG automaticamente: `npm run otimize:svg`
- Adicionar `viewBox` para responsividade
- Tamanho padrão: siga o guia `docs/BADGE_STANDARD.md` (badges) e mantenha banners em proporções consistentes

2. **Organizar**:

- Badges → `public/svg/badges/` (ex.: `skills/`, `info/`, `decorativos/`)
- Banners → `public/svg/banner/`
- Logos → `public/svg/mim/`

3. **Documentar**:
   - Adicionar entrada em `docs/GALERIA-SVG.md`
   - Incluir exemplo de uso e preview

### 📝 Melhorar Documentação

Documentação está em `/docs`. Áreas que sempre precisam de ajuda:

- Tutoriais e guias
- Exemplos de código
- Traduções
- Correções de typos

### ✍️ Escrever Posts no Blog

Veja [docs/CRIAR-POSTS-BLOG.md](./docs/CRIAR-POSTS-BLOG.md) para instruções detalhadas.

## 🔧 Processo de Desenvolvimento

### 1️⃣ Preparar Ambiente

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU-USUARIO/galeria.git
cd galeria

# Adicione o repositório original como upstream
git remote add upstream https://github.com/blue-diaz/galeria.git

# Instale dependências
npm install

# Execute em desenvolvimento
npm run dev
```

### 2️⃣ Criar Branch

```bash
# Atualize main
git checkout main
git pull upstream main

# Crie branch com nome descritivo
git checkout -b tipo/descricao-curta

# Exemplos:
# git checkout -b feat/adicionar-badge-python
# git checkout -b fix/corrigir-responsivo-mobile
# git checkout -b docs/atualizar-readme
```

**Convenção de Nomes de Branch:**

- `feat/` - Nova feature
- `fix/` - Correção de bug
- `docs/` - Documentação
- `style/` - Formatação, estilo
- `refactor/` - Refatoração
- `test/` - Testes
- `chore/` - Configurações, build

### 3️⃣ Fazer Mudanças

Siga os [Padrões de Código](#padrões-de-código) ao desenvolver.

### 4️⃣ Testar Localmente

```bash
# Lint
npm run lint:all

# Build
npm run build

# Testar build
npm start
```

### 5️⃣ Commit

Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "tipo: descrição curta

Descrição detalhada opcional explicando o que mudou e por quê.

Closes #123"
```

**Tipos de Commit:**

- `feat:` Nova feature
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `perf:` Performance
- `test:` Testes
- `chore:` Build, configs
- `ci:` CI/CD
- `revert:` Reverter commit

**Exemplos:**

```bash
feat: adicionar badge Python com logo oficial

Adiciona novo badge para Python com logo oficial e gradiente
personalizado seguindo a paleta de cores do projeto.

Closes #45

---

fix: corrigir overflow horizontal no mobile

Adiciona `overflow-x: hidden` e `max-width: 100%` nos containers
para prevenir scroll horizontal indesejado em dispositivos móveis.

Fixes #67

---

docs: atualizar guia de contribuição

Adiciona seção sobre padrões de commits e processo de review.
```

### 6️⃣ Push e Pull Request

```bash
# Push para seu fork
git push origin sua-branch

# Abra Pull Request no GitHub
# Use o template de PR preenchendo todas as seções
```

## 🎨 Padrões de Código

### TypeScript

- **Strict Mode**: Todas as verificações TypeScript habilitadas
- **No `any`**: Use tipos específicos
- **Interfaces**: Prefira `interface` sobre `type` para objetos
- **Naming**: `PascalCase` para tipos, `camelCase` para variáveis

```typescript
// ✅ Bom
interface BadgeProps {
  title: string;
  color: string;
  gradient?: boolean;
}

const createBadge = (props: BadgeProps): string => {
  // ...
};

// ❌ Ruim
const createBadge = (props: any) => {
  // ...
};
```

### React/Next.js

- **Componentes**: Usar `function` declarations
- **Hooks**: Seguir Rules of Hooks
- **CSS Modules**: Para estilos de componentes
- **Server Components**: Por padrão no App Router

```tsx
// ✅ Bom
import styles from "./Badge.module.css";

interface BadgeProps {
  title: string;
}

export default function Badge({ title }: BadgeProps) {
  return <div className={styles.badge}>{title}</div>;
}

// ❌ Ruim
export default function Badge(props) {
  return <div style={{ color: "red" }}>{props.title}</div>;
}
```

### CSS

- **CSS Modules**: Um arquivo por componente
- **Ordenação**: Alfabética (Stylelint enforça)
- **Variáveis**: Usar CSS custom properties
- **Mobile First**: Media queries de menor para maior

```css
/* ✅ Bom */
.badge {
  align-items: center;
  background: var(--accent-blue);
  border-radius: 5px;
  color: white;
  display: flex;
  padding: 10px 20px;
}

@media (min-width: 768px) {
  .badge {
    padding: 15px 30px;
  }
}

/* ❌ Ruim */
.badge {
  padding: 10px 20px;
  color: white;
  background: #1a4d5c; /* use variável */
  display: flex;
}
```

### Linting

Projeto usa ESLint, Stylelint e Prettier. Antes de commitar:

```bash
# Verificar tudo

# Otimizar SVGs
npm run otimize:svg
npm run lint:all

# Corrigir automaticamente
npm run fix:all
```

**Configurações:**

- ESLint: 40+ regras strict (async, naming, React)
- Stylelint: Ordenação alfabética obrigatória
- SVGO: Otimização automática de SVGs (mantém viewBox, IDs)
- Prettier: Formatação automática

## 🔍 Processo de Pull Request

### Antes de Abrir o PR

- [ ] ✅ Todos os lints passam (`npm run lint:all`)
- [ ] 🏗️ Build funciona (`npm run build`)
- [ ] 📄 Licenças verificadas (`npm run license:audit`)
- [ ] 📱 Testado em mobile
- [ ] 🌐 Testado em diferentes navegadores
- [ ] 📝 Documentação atualizada

### Template do PR

Use o [PR Template](.github/pull_request_template.md) completo:

- Descrição clara das mudanças
- Tipo de mudança (bug fix, feature, etc)
- Screenshots (se UI)
- Como testar
- Checklist completo

### Review

Depois de abrir o PR:

1. **CI passa**: Workflows GitHub Actions devem passar
2. **Review de código**: Aguarde review de mantenedores
3. **Mudanças solicitadas**: Faça alterações se necessário
4. **Aprovação**: Após aprovação, será merged

**Tempo de resposta esperado:**

- Issues: 24-48h
- PRs simples: 2-3 dias
- PRs complexos: 1 semana

### Após Merge

- Branch será deletado automaticamente
- Mudanças irão para produção no próximo deploy
- Você será creditado nos release notes

## 📦 Estrutura do Projeto

```
galeria/
├── .github/              # GitHub configs
│   ├── workflows/        # CI/CD (3 workflows)
│   └── ISSUE_TEMPLATE/   # Templates de issues
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── blog/             # Blog system
│   ├── components/       # React components
│   └── galeria/          # Gallery pages
├── content/              # MDX content
│   └── posts/            # Blog posts
├── docs/                 # Documentation
├── lib/                  # Utilities
├── public/               # Static assets
│   └── svg/              # SVG files
└── package.json
```

## 🔒 Segurança

Se encontrar vulnerabilidades de segurança:

1. **NÃO** abra issue pública
2. Entre em contato diretamente:

- Email: mocoto.persona@gmail.com
- GitHub (privado quando possível): https://github.com/blue-diaz/galeria

3. Aguarde confirmação antes de disclosure

## 📄 Licenças

- Projeto é MIT License
- Contribuições serão licenciadas sob MIT
- Use apenas dependências com licenças compatíveis
- Verifique: `npm run license:audit` (ou `npm run license:full`)
- Veja: [docs/AUDITORIA-LICENCAS.md](./docs/AUDITORIA-LICENCAS.md)

## 💬 Comunidade

### Onde Pedir Ajuda

- 🐛 **Bugs**: [Abrir Issue](https://github.com/blue-diaz/galeria/issues/new/choose)
- 💡 **Features**: [Feature Request](https://github.com/blue-diaz/galeria/issues/new/choose)
- ❓ **Dúvidas**: [Question Issue](https://github.com/blue-diaz/galeria/issues/new/choose)
- 📧 **Suporte**: [Email](mailto:mocoto.persona@gmail.com)

### Comunicação

- **Issues**: Português ou Inglês
- **PRs**: Português preferível
- **Commits**: Português
- **Código/Comentários**: Português ou Inglês

## 🎉 Reconhecimento

Todos os contribuidores serão:

- Listados nos release notes
- Creditados no README (contribuidores frequentes)
- Mencionados nas redes sociais (contribuições significativas)
- Convidados para participar da comunidade Black Diaz

## 🙏 Primeiros Passos

Novo por aqui? Comece com:

1. 🔍 **Good First Issues**: [Ver issues](https://github.com/blue-diaz/galeria/labels/good%20first%20issue)
2. 📚 **Documentação**: Sempre precisa melhorias
3. 🐛 **Typos**: Correções simples são bem-vindas
4. 🎨 **SVGs**: Contribua com novos designs

## 📞 Contato

**Dúvidas sobre contribuição?**

- 📧 Email: mocoto.persona@gmail.com
- 🌐 Website: [black-diaz.vercel.app](https://black-diaz.vercel.app)

---

**Obrigado por contribuir! Juntos tornamos a Galeria Black Diaz ainda melhor! 🎨**

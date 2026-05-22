# Feedback - aviso-001.json

## Falsos Positivos

### 1. `CONTRIBUTING.md` - pontuação repetida (linha 1)
**Falso positivo.** A linha 1 (`> Proveniência e Autoria: ...`) não contém pontuação repetida. O scanner provavelmente confundiu o `>` de blockquote como pontuação. Sugestão: ajustar a regex do analisador para ignorar caracteres de markdown (`, >, -`).

### 2. `SECURITY.md` - pontuação repetida (linha 1)
**Falso positivo.** A linha 1 é `<!--` (abertura de comentário HTML). Não há pontuação repetida. Sugestão: adicionar `<!--`, `-->`, ```` ``` ```` à lista de exclusão do analisador.

### 3. `prometheus.config.json` - formatador-json (linha 200)
**Falso positivo.** O JSON já está formatado com indentação consistente de 2 espaços. O aviso indica "primeira diferença na linha 200", mas a formatação é uniforme em todo o arquivo. Possível diferença na ordem das chaves ou no formato esperado pelo formatador do Prometheus. Sugestão: verificar se o formatador do Prometheus reordena chaves ou usa outro estilo (ex: trailing commas, aspas).

### 4. `vercel.json` - formatador-json (linha 9)
**Falso positivo.** Arquivo JSON pequeno e perfeitamente formatado. Mesma causa do item 3.

### 5. `GitHubStatsPreview.tsx` - conflitos shadow (linhas 44, 51, 126, 149, 182)
### 6. `GitHubTopLangsPreview.tsx` - conflitos shadow (linhas 43, 50, 125, 148, 181)
**Falsos positivos.** O Tailwind permite múltiplas classes `shadow-*` no mesmo elemento para combinar sombra estrutural (`shadow-lg`, `shadow-md`, `shadow-inner`) com cor personalizada (`shadow-black/20`, `shadow-[var(--accent-teal)]/20`). Isso é um padrão intencional e válido. Sugestão: desabilitar a regra `tailwindcss/regra` para combinações de `shadow-*` com `shadow-[*]`, ou treinar o analisador para reconhecer esse padrão como válido.

## Correções Aplicadas

### 1. `src/app/galeria/visitors/_components/VisitorsBadgeGrid.tsx` - interface inline
**Corrigido.** A interface `BadgeVariant` era idêntica à `VisitorVariant` já exportada em `src/types/visitor.ts`. Substituída por um alias `type BadgeVariant = VisitorVariant` com import do tipo existente.

### 2. `src/lib/cloneBadgeBase.ts` - missing-jsdoc
**Corrigido.** Adicionado JSDoc descritivo ao template SVG exportado.

### 3. `src/lib/cloneBadgeSvg.ts` - missing-jsdoc
**Corrigido.** Adicionado JSDoc ao arquivo e à função `renderCloneBadgeSvg`.

## Sugestões de Melhoria para o Scanner

1. **Regra `pontuacao-repetida`**: Ignorar caracteres de formatação de markdown (`, >, -`) e delimitadores de comentário HTML (`<!--`, `-->`).

2. **Regra `formatador-json`**: Aceitar JSON válido independentemente da ordem das chaves ou aplicar um formatador padrão (ex: `prettier`) como referência em vez de um formatador específico do Prometheus.

3. **Regra `tailwindcss/regra` para shadow**: Ignorar conflitos entre `shadow-{size}` e `shadow-{color}` ou `shadow-[custom]`, pois é um padrão legítimo do Tailwind para sombras com cores personalizadas.

4. **Regra `interface-inline-exportada`**: Verificar se já existe um tipo equivalente em `src/types/` antes de sugerir a criação. Se existir, sugerir reutilização em vez de duplicação.

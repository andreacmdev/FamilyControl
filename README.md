# FamilyControl

Webapp privado para organização da família. Centraliza agenda, finanças e informações dos membros em um único lugar, com interface acolhedora e atualizações em tempo real.

> Projeto de uso interno — não é um produto comercial.

---

## Funcionalidades

### 🏠 Home
- **Versículo do dia** — muda automaticamente a cada dia (14 versículos cadastrados)
- **Aniversários próximos** — exibe membros com aniversário nos próximos 30 dias, com idade e contagem de dias
- **Próximos eventos** — lista os próximos 5 eventos da agenda com categoria colorida
- **Resumo financeiro** — cards com total de receitas, despesas e saldo do mês atual

### 📅 Agenda
- Calendário mensal com marcadores visuais nos dias que têm eventos
- Clique em um dia para ver os eventos daquela data
- Lista de próximos eventos a partir de hoje
- **Categorias:** Família, Igreja, Saúde, Trabalho, Financeiro, Casa, Outros
- Filtro por categoria (chips toggleáveis)
- CRUD completo: criar, editar e excluir eventos
- Campos: título, descrição, data, hora, categoria, responsável (membro), fonte
- Atualizações em tempo real via Supabase Realtime

### 💰 Financeiro
- Navegação por mês (anterior / próximo)
- Cards de resumo: total de receitas, total de despesas e saldo
- **Lançamentos de receita** com categorias próprias:
  - Salário, Freelance, Aluguel, Bônus, Rendimento, Outros
- **Lançamentos de despesa** com categorias próprias:
  - Casa, Saúde, Transporte, Assinaturas, Igreja, Mercado, Pessoal, Investimento, Meta, Outros
- Toggle pago / pendente com data de pagamento automática
- Ícone visual para lançamentos recorrentes
- **Lançamentos recorrentes com data fim** — informa "repetir até mês/ano" e o sistema cria uma parcela por mês automaticamente
- **Metas financeiras:**
  - Barra de progresso (valor acumulado / valor alvo)
  - Marcar meta como concluída
  - Data alvo opcional
  - Lista separada de ativas e concluídas
- **Observações do mês** — campo de texto livre com auto-save (debounce 800ms)
- Atualizações em tempo real via Supabase Realtime (delta updates sem refetch)

### 👥 Configurações — Membros
- Cadastro de membros da família
- Avatar gerado por iniciais com cor personalizada (9 opções)
- Campos: nome, apelido, cor, data de nascimento
- Editar e remover membros (com confirmação)
- Atualizações em tempo real

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16.2 (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| Componentes | shadcn/ui (Base UI) |
| Banco de dados | Supabase (PostgreSQL) |
| Realtime | Supabase Realtime (postgres_changes) |
| Formulários | react-hook-form + Zod v4 |
| Deploy | Firebase Hosting |

---

## Estrutura do projeto

```
src/
├── app/
│   ├── (app)/                    # Rotas protegidas com layout
│   │   ├── layout.tsx            # Sidebar + Header
│   │   ├── page.tsx              # Home (dashboard)
│   │   ├── agenda/page.tsx
│   │   ├── financeiro/page.tsx
│   │   └── configuracoes/page.tsx
│   ├── globals.css               # Tema global (paleta quente amber/terracota)
│   └── layout.tsx                # Root layout
│
├── components/
│   ├── agenda/
│   │   ├── agenda-calendar.tsx   # Calendário com dot indicators
│   │   ├── agenda-filters.tsx    # Chips de filtro por categoria
│   │   ├── event-dialog.tsx      # Modal de criação/edição
│   │   ├── event-form.tsx        # Formulário de evento
│   │   └── upcoming-events.tsx   # Lista de próximos eventos
│   ├── financeiro/
│   │   ├── entries-panel.tsx     # Painel de receitas ou despesas
│   │   ├── entry-dialog.tsx      # Modal de criação/edição
│   │   ├── entry-form.tsx        # Formulário de lançamento
│   │   ├── goal-form.tsx         # Formulário de meta
│   │   ├── goals-panel.tsx       # Painel de metas com progress bar
│   │   ├── month-navigation.tsx  # Navegação de mês
│   │   ├── monthly-note.tsx      # Observações com auto-save
│   │   └── summary-cards.tsx     # Cards de resumo mensal
│   ├── home/
│   │   ├── versiculo-widget.tsx
│   │   ├── aniversarios-widget.tsx
│   │   ├── proximos-eventos-widget.tsx
│   │   └── resumo-financeiro-widget.tsx
│   ├── layout/
│   │   ├── app-header.tsx
│   │   └── app-sidebar.tsx
│   ├── membros/
│   │   ├── member-form.tsx
│   │   └── members-panel.tsx     # Lista + MemberAvatar (exportado)
│   └── ui/                       # Componentes shadcn/ui
│
├── hooks/
│   ├── use-agenda-events.ts      # useAgendaEvents + useUpcomingEvents
│   ├── use-financial.ts          # useMonthlyEntries + useMonthlyNote
│   ├── use-goals.ts              # useGoals
│   └── use-members.ts            # useMembers
│
├── lib/
│   ├── actions/
│   │   ├── agenda.ts             # Server Actions: createEvent, updateEvent, deleteEvent
│   │   ├── financeiro.ts         # createEntry (com geração de parcelas), updateEntry, deleteEntry, toggleEntryStatus, upsertMonthlyNote
│   │   ├── goals.ts              # createGoal, updateGoal, deleteGoal, toggleGoalCompleted
│   │   └── members.ts            # createMember, updateMember, deleteMember
│   ├── supabase/
│   │   ├── client.ts             # createBrowserClient
│   │   └── server.ts             # createServerClient (cookies)
│   ├── agenda.ts                 # CATEGORY_CONFIG, formatEventDate, formatEventTime, isToday
│   ├── financeiro.ts             # DESPESA_CATEGORY_CONFIG, RECEITA_CATEGORY_CONFIG, getCategoryConfig, formatCurrency
│   └── utils.ts                  # cn()
│
├── types/
│   └── database.ts               # Tipagens completas: FamilyMember, AgendaEvent, FinancialEntry, FinancialGoal, MonthlyNote, enums
│
└── supabase/
    └── migrations/
        ├── 001_initial_schema.sql
        └── 002_add_birth_date.sql
```

---

## Banco de dados

### Tabelas

| Tabela | Descrição |
|--------|-----------|
| `family_members` | Membros da família (nome, apelido, cor, data de nascimento) |
| `agenda_events` | Eventos da agenda (título, data, hora, categoria, responsável) |
| `financial_entries` | Lançamentos financeiros (receita/despesa, valor, categoria, status, recorrência) |
| `financial_goals` | Metas financeiras (valor alvo, acumulado, prazo, status) |
| `monthly_notes` | Observações mensais do financeiro (único por mês/ano) |

### Enums

```sql
agenda_category:     familia | igreja | saude | trabalho | financeiro | casa | outros
entry_type:          receita | despesa
entry_status:        pago | pendente
financial_category:  -- despesas: casa | saude | transporte | assinaturas | igreja | mercado | pessoal | investimento | meta | outros
                     -- receitas: salario | freelance | aluguel | bonus | rendimento | outros
```

---

## Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Conta no Supabase

### Instalação

```bash
git clone git@github.com:andreacmdev/FamilyControl.git
cd FamilyControl
npm install
```

### Variáveis de ambiente

Crie o arquivo `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### Banco de dados

Execute as migrations no SQL Editor do Supabase:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_add_birth_date.sql`

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`.

---

## Padrões técnicos

### Realtime
Todos os módulos usam Supabase Realtime com **delta updates** — cada evento `INSERT`, `UPDATE` e `DELETE` é aplicado diretamente no estado React sem refazer a requisição HTTP. Isso garante atualizações instantâneas em todos os dispositivos abertos.

### Mutações client-side
Mutações (`create`, `update`, `delete`) são feitas diretamente pelo Supabase browser client — sem Server Actions. Após cada mutação, `refetch()` é chamado imediatamente para atualizar o estado local. O Realtime permanece ativo para sincronizar outros dispositivos. O cast `(supabase as any)` é necessário por incompatibilidade de tipos do `supabase-js v2.101` com o generic `Database` customizado.

### Formulários
`react-hook-form` + `Zod v4`. Atenção: Zod v4 não suporta `invalid_type_error` — campos numéricos usam `z.string().refine()` com conversão manual em `onSubmit`.

### Componentes Base UI
O projeto usa **Base UI** (não Radix UI). O padrão correto para compor triggers é `render={<Button />}` em vez de `asChild`.

---

### Deploy

```bash
npm run deploy   # build + firebase deploy --only hosting
```

O app é exportado como estático (`output: export`) para a pasta `out` e publicado no Firebase Hosting gratuito.

---

## Roadmap

- [ ] Integração WhatsApp via Z-API (notificações de eventos e vencimentos)
- [ ] Domínio personalizado no Firebase Hosting

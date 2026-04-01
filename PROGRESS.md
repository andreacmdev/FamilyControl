# FamilyControl — Progresso do MVP

> Atualizado conforme as etapas vão sendo concluídas.

---

## Etapa 1 — Base do projeto ✅

- [x] Projeto Next.js + TypeScript criado
- [x] Tailwind CSS v4 configurado
- [x] shadcn/ui instalado e configurado
- [x] Tema acolhedor (paleta quente, sem cara de ERP)
- [x] Layout base: Sidebar + Header responsivos
- [x] Página inicial (Dashboard)
- [x] Página Agenda (vazia)
- [x] Página Financeiro (vazia)
- [x] Página Configurações (vazia)
- [x] Tipagens TypeScript completas (`src/types/database.ts`)
- [x] Repositório no GitHub criado e branch publicada

---

## Etapa 2 — Supabase & Banco de dados ✅

- [x] Projeto Supabase criado
- [x] Variáveis de ambiente configuradas (`.env.local`)
- [x] Migration SQL executada no Supabase
- [x] Conexão testada e validada
- [x] Supabase conectado ao projeto Next.js

---

## Etapa 3 — Módulo Agenda ✅

### 3a — Visualização ✅
- [x] Calendário mensal visual com pontinhos nos dias com evento
- [x] Eventos do dia ao clicar no calendário
- [x] Lista de próximos eventos (a partir de hoje)
- [x] Cores por categoria
- [x] Integração com Supabase (leitura)
- [x] Realtime: atualizações instantâneas sem refresh manual

### 3b — Cadastro / edição ✅
- [x] Modal de cadastro de evento
- [x] Edição de evento
- [x] Exclusão de evento

### 3c — Filtros ✅
- [x] Filtro por categoria
- [x] Limpar filtros

---

## Etapa 4 — Módulo Financeiro ✅

### 4a — Visão geral do mês ✅
- [x] Cards de resumo: total receitas, total despesas, saldo
- [x] Navegação por mês
- [x] Observações do mês (auto-save com debounce)

### 4b — Lançamentos ✅
- [x] Painel de receitas e despesas separados
- [x] Categorias distintas por tipo (receita ≠ despesa)
  - Receitas: Salário, Freelance, Aluguel, Bônus, Rendimento
  - Despesas: Casa, Saúde, Transporte, Assinaturas, Igreja, Mercado, Pessoal, Investimento, Meta, Outros
- [x] Despesas/receitas recorrentes com data fim (gera parcelas mensais automáticas)
- [x] Toggle pago/pendente com data de pagamento
- [x] Ícone de recorrente na listagem
- [x] Realtime delta updates (sem round-trip extra)

### 4c — Metas financeiras ✅
- [x] Painel de metas com barra de progresso
- [x] CRUD completo: criar, editar, excluir
- [x] Marcar meta como concluída (lista separada)
- [x] Valor acumulado, valor alvo, % de progresso, data alvo
- [x] Realtime delta updates

---

## Etapa 5 — Membros da família & Configurações ✅

- [x] Cadastro de membros
- [x] Avatar por iniciais com cor personalizada (9 opções)
- [x] Campos: nome, apelido, cor, data de nascimento
- [x] Editar e remover com confirmação
- [x] Página de configurações funcional
- [x] Realtime delta updates

---

## Etapa 6 — Home personalizada ✅

- [x] Versículo do dia (rotativo por dia do ano, 14 versículos)
- [x] Aniversários próximos (próximos 30 dias, oculto se não houver)
- [x] Próximos eventos em destaque (link para agenda)
- [x] Resumo financeiro do mês (receitas, despesas, saldo)
- [x] Campo birth_date adicionado aos membros da família

---

## Etapa 7 — Deploy ✅

- [x] Server Actions convertidas para client-side (static export)
- [x] Firebase Hosting configurado (`firebase.json` + `.firebaserc`)
- [x] Build de produção validado (`output: export`)
- [x] Deploy realizado no Firebase Hosting (plano gratuito)
- [x] Script de deploy: `npm run deploy`
- [ ] Domínio personalizado (opcional)

---

## Integrações futuras

- [ ] Z-API (WhatsApp) — notificações de eventos e vencimentos

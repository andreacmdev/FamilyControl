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

## Etapa 2 — Supabase & Banco de dados 🔄

- [x] Projeto Supabase criado
- [x] Variáveis de ambiente configuradas (`.env.local`)
- [x] Migration SQL executada no Supabase
- [x] Conexão testada e validada ✅
- [x] Supabase conectado ao projeto Next.js

---

## Etapa 3 — Módulo Agenda

### 3a — Visualização ✅
- [x] Calendário mensal visual com pontinhos nos dias com evento
- [x] Eventos do dia ao clicar no calendário
- [x] Lista de próximos eventos (a partir de hoje)
- [x] Cores por categoria
- [x] Integração com Supabase (leitura)

### 3b — Cadastro / edição ✅
- [x] Modal de cadastro de evento
- [x] Edição de evento
- [x] Exclusão de evento

### 3c — Filtros
- [ ] Filtro por categoria
- [ ] Filtro por responsável

---

## Etapa 4 — Módulo Financeiro

- [ ] Visão geral do mês (resumo)
- [ ] Lista de contas a pagar
- [ ] Lista de contas a receber
- [ ] Cadastro de lançamento
- [ ] Edição e exclusão de lançamento
- [ ] Controle de dízimo
- [ ] Metas financeiras
- [ ] Observações do mês
- [ ] Valor disponível estimado
- [ ] Integração completa com Supabase

---

## Etapa 5 — Membros da família & Configurações

- [ ] Cadastro de membros
- [ ] Foto/avatar por membro
- [ ] Associar eventos a membros
- [ ] Página de configurações funcional

---

## Etapa 6 — Home personalizada

- [ ] Versículos bíblicos rotativos
- [ ] Aniversários do mês
- [ ] Próximos eventos em destaque
- [ ] Resumo financeiro do mês
- [ ] Identidade visual da família

---

## Etapa 7 — Deploy

- [ ] Firebase Hosting configurado
- [ ] Build de produção validado
- [ ] Deploy realizado
- [ ] Domínio configurado (opcional)

---

## Integrações futuras

- [ ] Z-API (WhatsApp) — notificações de eventos e vencimentos

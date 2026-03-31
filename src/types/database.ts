export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      family_members: {
        Row: FamilyMember;
        Insert: Omit<FamilyMember, "id" | "created_at">;
        Update: Partial<Omit<FamilyMember, "id" | "created_at">>;
        Relationships: [];
      };
      agenda_events: {
        Row: AgendaEvent;
        Insert: Omit<AgendaEvent, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<AgendaEvent, "id" | "created_at">>;
        Relationships: [];
      };
      financial_entries: {
        Row: FinancialEntry;
        Insert: Omit<FinancialEntry, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<FinancialEntry, "id" | "created_at">>;
        Relationships: [];
      };
      financial_goals: {
        Row: FinancialGoal;
        Insert: Omit<FinancialGoal, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<FinancialGoal, "id" | "created_at">>;
        Relationships: [];
      };
      monthly_notes: {
        Row: MonthlyNote;
        Insert: Omit<MonthlyNote, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<MonthlyNote, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: {
      agenda_category: AgendaCategory;
      financial_category: FinancialCategory;
      entry_type: EntryType;
      entry_status: EntryStatus;
    };
    CompositeTypes: Record<string, unknown>;
  };
}

// ─── Família ─────────────────────────────────────────────────────────────────

export interface FamilyMember {
  id: string;
  name: string;
  nickname: string | null;
  avatar_url: string | null;
  color: string | null;
  birth_date: string | null;
  created_at: string;
}

// ─── Agenda ──────────────────────────────────────────────────────────────────

export type AgendaCategory =
  | "familia"
  | "igreja"
  | "saude"
  | "trabalho"
  | "financeiro"
  | "casa"
  | "outros";

export interface AgendaEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  category: AgendaCategory;
  responsible_member: string | null;
  source: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Financeiro ──────────────────────────────────────────────────────────────

export type EntryType = "receita" | "despesa";

export type EntryStatus = "pendente" | "pago" | "cancelado";

// Categorias de despesa
export type DespesaCategory =
  | "casa"
  | "saude"
  | "transporte"
  | "assinaturas"
  | "igreja"
  | "mercado"
  | "pessoal"
  | "investimento"
  | "meta"
  | "outros";

// Categorias de receita
export type ReceitaCategory =
  | "salario"
  | "freelance"
  | "aluguel"
  | "bonus"
  | "rendimento"
  | "outros";

export type FinancialCategory = DespesaCategory | ReceitaCategory;

export interface FinancialEntry {
  id: string;
  entry_type: EntryType;
  description: string;
  amount: number;
  due_date: string | null;
  paid_date: string | null;
  category: FinancialCategory;
  status: EntryStatus;
  is_recurring: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  description: string | null;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface MonthlyNote {
  id: string;
  year: number;
  month: number;
  content: string;
  created_at: string;
  updated_at: string;
}

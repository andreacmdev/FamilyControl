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
      };
      agenda_events: {
        Row: AgendaEvent;
        Insert: Omit<AgendaEvent, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<AgendaEvent, "id" | "created_at">>;
      };
      financial_entries: {
        Row: FinancialEntry;
        Insert: Omit<FinancialEntry, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<FinancialEntry, "id" | "created_at">>;
      };
      financial_goals: {
        Row: FinancialGoal;
        Insert: Omit<FinancialGoal, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<FinancialGoal, "id" | "created_at">>;
      };
      monthly_notes: {
        Row: MonthlyNote;
        Insert: Omit<MonthlyNote, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<MonthlyNote, "id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      agenda_category: AgendaCategory;
      financial_category: FinancialCategory;
      entry_type: EntryType;
      entry_status: EntryStatus;
    };
  };
}

// ─── Família ─────────────────────────────────────────────────────────────────

export interface FamilyMember {
  id: string;
  name: string;
  nickname: string | null;
  avatar_url: string | null;
  color: string | null;
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

export type FinancialCategory =
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

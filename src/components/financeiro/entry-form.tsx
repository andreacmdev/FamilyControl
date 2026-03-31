"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DESPESA_CATEGORY_CONFIG,
  RECEITA_CATEGORY_CONFIG,
  STATUS_CONFIG,
} from "@/lib/financeiro";
import { createEntry, updateEntry, type EntryPayload } from "@/lib/actions/financeiro";
import type { FinancialEntry, EntryType } from "@/types/database";

const DESPESA_CATEGORIES = Object.keys(DESPESA_CATEGORY_CONFIG) as Array<keyof typeof DESPESA_CATEGORY_CONFIG>;
const RECEITA_CATEGORIES = Object.keys(RECEITA_CATEGORY_CONFIG) as Array<keyof typeof RECEITA_CATEGORY_CONFIG>;

const schema = z.object({
  description:     z.string().min(1, "Descrição obrigatória").max(100),
  amount:          z.string().min(1, "Valor obrigatório").refine(
    (v) => !isNaN(Number(v)) && Number(v) > 0,
    "Valor deve ser positivo"
  ),
  due_date:        z.string().optional(),
  category:        z.string().min(1),
  status:          z.enum(["pendente", "pago", "cancelado"]),
  is_recurring:    z.boolean(),
  recurring_until: z.string().optional(),
  notes:           z.string().max(300).optional(),
});

type FormValues = z.infer<typeof schema>;

interface EntryFormProps {
  entry?: FinancialEntry;
  defaultType?: EntryType;
  defaultDueDate?: string;
  onSuccess: () => void;
}

export function EntryForm({ entry, defaultType = "despesa", defaultDueDate, onSuccess }: EntryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const entryType = entry?.entry_type ?? defaultType;
  const categoryConfig = entryType === "receita" ? RECEITA_CATEGORY_CONFIG : DESPESA_CATEGORY_CONFIG;
  const categoryKeys = entryType === "receita" ? RECEITA_CATEGORIES : DESPESA_CATEGORIES;
  const defaultCategory = entryType === "receita" ? "salario" : "outros";

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description:     entry?.description ?? "",
      amount:          entry?.amount != null ? String(entry.amount) : "",
      due_date:        entry?.due_date ?? defaultDueDate ?? "",
      category:        entry?.category ?? defaultCategory,
      status:          entry?.status ?? "pendente",
      is_recurring:    entry?.is_recurring ?? false,
      recurring_until: "",
      notes:           entry?.notes ?? "",
    },
  });

  const category     = watch("category");
  const status       = watch("status");
  const is_recurring = watch("is_recurring");

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError(null);
    try {
      const payload: EntryPayload = {
        entry_type:      entryType,
        description:     values.description,
        amount:          Number(values.amount),
        due_date:        values.due_date || undefined,
        category:        values.category as import("@/types/database").FinancialCategory,
        status:          values.status,
        is_recurring:    values.is_recurring,
        recurring_until: values.is_recurring ? values.recurring_until : undefined,
        notes:           values.notes,
      };
      if (entry) await updateEntry(entry.id, payload);
      else       await createEntry(payload);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Descrição */}
      <div className="space-y-1.5">
        <Label htmlFor="description">
          Descrição <span className="text-destructive">*</span>
        </Label>
        <Input id="description" placeholder={entryType === "receita" ? "Ex: Salário março" : "Ex: Conta de luz"} {...register("description")} />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      {/* Valor e Data */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="amount">Valor <span className="text-destructive">*</span></Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
            <Input id="amount" type="number" step="0.01" min="0" className="pl-9" placeholder="0,00" {...register("amount")} />
          </div>
          {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="due_date">{entryType === "receita" ? "Data de entrada" : "Vencimento"}</Label>
          <Input id="due_date" type="date" {...register("due_date")} />
        </div>
      </div>

      {/* Categoria e Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Categoria</Label>
          <Select
            value={category}
            onValueChange={(v) => v && setValue("category", v, { shouldValidate: true })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {categoryKeys.map((key) => {
                const cfg = categoryConfig[key as keyof typeof categoryConfig];
                return (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={status}
            onValueChange={(v) => setValue("status", v as FormValues["status"], { shouldValidate: true })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recorrente */}
      <div className="space-y-3">
        <label className="flex items-center gap-2.5 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={is_recurring}
            onChange={(e) => setValue("is_recurring", e.target.checked)}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-sm text-foreground">Lançamento recorrente (mensal)</span>
        </label>

        {is_recurring && !entry && (
          <div className="space-y-1.5 pl-6">
            <Label htmlFor="recurring_until">
              Repetir até <span className="text-destructive">*</span>
              <span className="ml-1 text-xs text-muted-foreground font-normal">(mês/ano)</span>
            </Label>
            <Input
              id="recurring_until"
              type="month"
              {...register("recurring_until")}
            />
            <p className="text-xs text-muted-foreground">
              Uma entrada será criada para cada mês até essa data.
            </p>
          </div>
        )}

        {is_recurring && entry && (
          <p className="text-xs text-muted-foreground pl-6">
            Para alterar o período, edite cada lançamento individualmente.
          </p>
        )}
      </div>

      {/* Observações */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" placeholder="Detalhes adicionais..." rows={2} {...register("notes")} />
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex justify-end pt-1">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Salvando..."
            : entry
            ? "Salvar alterações"
            : is_recurring
            ? "Criar parcelas"
            : "Criar lançamento"}
        </Button>
      </div>
    </form>
  );
}

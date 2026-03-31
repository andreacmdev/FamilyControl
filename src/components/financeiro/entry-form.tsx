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
import { CATEGORY_CONFIG, STATUS_CONFIG } from "@/lib/financeiro";
import { createEntry, updateEntry, type EntryPayload } from "@/lib/actions/financeiro";
import type { FinancialEntry, EntryType } from "@/types/database";

const schema = z.object({
  description: z.string().min(1, "Descrição obrigatória").max(100),
  amount: z.string().min(1, "Valor obrigatório").refine(
    (v) => !isNaN(Number(v)) && Number(v) > 0,
    "Valor deve ser positivo"
  ),
  due_date: z.string().optional(),
  category: z.enum(["casa","saude","transporte","assinaturas","igreja","mercado","pessoal","investimento","meta","outros"]),
  status: z.enum(["pendente","pago","cancelado"]),
  is_recurring: z.boolean(),
  notes: z.string().max(300).optional(),
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

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: entry?.description ?? "",
      amount: entry?.amount != null ? String(entry.amount) : "",
      due_date: entry?.due_date ?? defaultDueDate ?? "",
      category: entry?.category ?? "outros",
      status: entry?.status ?? "pendente",
      is_recurring: entry?.is_recurring ?? false,
      notes: entry?.notes ?? "",
    },
  });

  const category = watch("category");
  const status = watch("status");
  const is_recurring = watch("is_recurring");

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError(null);
    try {
      const payload: EntryPayload = {
        entry_type: entry?.entry_type ?? defaultType,
        description: values.description,
        amount: Number(values.amount),
        due_date: values.due_date || undefined,
        category: values.category,
        status: values.status,
        is_recurring: values.is_recurring,
        notes: values.notes,
      };
      if (entry) await updateEntry(entry.id, payload);
      else await createEntry(payload);
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
        <Label htmlFor="description">Descrição <span className="text-destructive">*</span></Label>
        <Input id="description" placeholder="Ex: Conta de luz" {...register("description")} />
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
          <Label htmlFor="due_date">Vencimento</Label>
          <Input id="due_date" type="date" {...register("due_date")} />
        </div>
      </div>

      {/* Categoria e Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Categoria</Label>
          <Select value={category} onValueChange={(v) => setValue("category", v as FormValues["category"], { shouldValidate: true })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setValue("status", v as FormValues["status"], { shouldValidate: true })}>
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
      <label className="flex items-center gap-2.5 cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={is_recurring}
          onChange={(e) => setValue("is_recurring", e.target.checked)}
          className="w-4 h-4 rounded accent-primary"
        />
        <span className="text-sm text-foreground">Lançamento recorrente</span>
      </label>

      {/* Observações */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" placeholder="Detalhes adicionais..." rows={2} {...register("notes")} />
      </div>

      {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex justify-end pt-1">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : entry ? "Salvar alterações" : "Criar lançamento"}
        </Button>
      </div>
    </form>
  );
}

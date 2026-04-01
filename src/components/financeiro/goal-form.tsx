"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createGoal, updateGoal, type GoalPayload } from "@/lib/actions/goals";
import type { FinancialGoal } from "@/types/database";

const schema = z.object({
  title:          z.string().min(1, "Título obrigatório"),
  description:    z.string().optional(),
  target_amount:  z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Valor inválido"),
  current_amount: z.string().refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Valor inválido"),
  target_date:    z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface GoalFormProps {
  goal?: FinancialGoal;
  onSuccess: () => void;
}

export function GoalForm({ goal, onSuccess }: GoalFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:          goal?.title ?? "",
      description:    goal?.description ?? "",
      target_amount:  goal ? String(goal.target_amount) : "",
      current_amount: goal ? String(goal.current_amount) : "0",
      target_date:    goal?.target_date ?? "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const payload: GoalPayload = {
        title:          values.title,
        description:    values.description,
        target_amount:  Number(values.target_amount),
        current_amount: Number(values.current_amount),
        target_date:    values.target_date || undefined,
      };
      if (goal) await updateGoal(goal.id, payload);
      else await createGoal(payload);
      onSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Título */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Título <span className="text-destructive">*</span></Label>
        <Input id="title" placeholder="Ex: Viagem de férias" {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      {/* Descrição */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" rows={2} placeholder="Detalhes da meta..." {...register("description")} />
      </div>

      {/* Valor alvo e atual */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="target_amount">Valor alvo <span className="text-destructive">*</span></Label>
          <Input id="target_amount" type="number" step="0.01" min="0.01" placeholder="0,00" {...register("target_amount")} />
          {errors.target_amount && <p className="text-xs text-destructive">{errors.target_amount.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="current_amount">Valor acumulado</Label>
          <Input id="current_amount" type="number" step="0.01" min="0" placeholder="0,00" {...register("current_amount")} />
          {errors.current_amount && <p className="text-xs text-destructive">{errors.current_amount.message}</p>}
        </div>
      </div>

      {/* Data alvo */}
      <div className="space-y-1.5">
        <Label htmlFor="target_date">Data alvo</Label>
        <Input id="target_date" type="date" {...register("target_date")} />
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Salvando..." : goal ? "Salvar alterações" : "Criar meta"}
      </Button>
    </form>
  );
}

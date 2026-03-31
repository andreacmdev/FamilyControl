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
import { CATEGORY_CONFIG } from "@/lib/agenda";
import { createEvent, updateEvent, type EventPayload } from "@/lib/actions/agenda";
import type { AgendaEvent } from "@/types/database";

const schema = z.object({
  title: z.string().min(1, "Título obrigatório").max(100),
  description: z.string().max(300).optional(),
  event_date: z.string().min(1, "Data obrigatória"),
  event_time: z.string().optional(),
  category: z.enum([
    "familia", "igreja", "saude", "trabalho", "financeiro", "casa", "outros",
  ]),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface EventFormProps {
  /** Se passado, entra em modo edição */
  event?: AgendaEvent;
  /** Data pré-selecionada ao abrir para criar */
  defaultDate?: string;
  onSuccess: () => void;
}

export function EventForm({ event, defaultDate, onSuccess }: EventFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      event_date: event?.event_date ?? defaultDate ?? "",
      event_time: event?.event_time?.slice(0, 5) ?? "",
      category: event?.category ?? "familia",
      notes: event?.notes ?? "",
    },
  });

  const category = watch("category");

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError(null);
    try {
      const payload: EventPayload = {
        title: values.title,
        description: values.description,
        event_date: values.event_date,
        event_time: values.event_time || undefined,
        category: values.category,
        notes: values.notes,
      };

      if (event) {
        await updateEvent(event.id, payload);
      } else {
        await createEvent(payload);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Título */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Título <span className="text-destructive">*</span></Label>
        <Input
          id="title"
          placeholder="Ex: Consulta médica"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Data e Hora */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="event_date">Data <span className="text-destructive">*</span></Label>
          <Input id="event_date" type="date" {...register("event_date")} />
          {errors.event_date && (
            <p className="text-xs text-destructive">{errors.event_date.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="event_time">Horário</Label>
          <Input id="event_time" type="time" {...register("event_time")} />
        </div>
      </div>

      {/* Categoria */}
      <div className="space-y-1.5">
        <Label>Categoria</Label>
        <Select
          value={category}
          onValueChange={(val) =>
            setValue("category", val as FormValues["category"], { shouldValidate: true })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
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

      {/* Descrição */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Detalhes do evento..."
          rows={2}
          {...register("description")}
        />
      </div>

      {/* Observações */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          placeholder="Observações internas..."
          rows={2}
          {...register("notes")}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : event ? "Salvar alterações" : "Criar evento"}
        </Button>
      </div>
    </form>
  );
}

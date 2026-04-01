"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMember, updateMember, type MemberPayload } from "@/lib/actions/members";
import type { FamilyMember } from "@/types/database";

const MEMBER_COLORS = [
  { value: "#f97316", label: "Laranja" },
  { value: "#eab308", label: "Amarelo" },
  { value: "#22c55e", label: "Verde" },
  { value: "#06b6d4", label: "Ciano" },
  { value: "#3b82f6", label: "Azul" },
  { value: "#a855f7", label: "Roxo" },
  { value: "#ec4899", label: "Rosa" },
  { value: "#ef4444", label: "Vermelho" },
  { value: "#78716c", label: "Cinza" },
];

const schema = z.object({
  name:       z.string().min(1, "Nome obrigatório"),
  nickname:   z.string().optional(),
  color:      z.string().optional(),
  birth_date: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface MemberFormProps {
  member?: FamilyMember;
  onSuccess: () => void;
}

export function MemberForm({ member, onSuccess }: MemberFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:       member?.name ?? "",
      nickname:   member?.nickname ?? "",
      color:      member?.color ?? MEMBER_COLORS[0].value,
      birth_date: member?.birth_date ?? "",
    },
  });

  const selectedColor = watch("color");

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const payload: MemberPayload = {
        name:       values.name,
        nickname:   values.nickname,
        color:      values.color,
        birth_date: values.birth_date,
      };
      if (member) await updateMember(member.id, payload);
      else await createMember(payload);
      onSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  // Preview do avatar com iniciais
  const initials = watch("name")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Preview do avatar */}
      <div className="flex justify-center">
        <div
          className="size-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow"
          style={{ backgroundColor: selectedColor || MEMBER_COLORS[0].value }}
        >
          {initials || "?"}
        </div>
      </div>

      {/* Nome */}
      <div className="space-y-1.5">
        <Label htmlFor="name">Nome <span className="text-destructive">*</span></Label>
        <Input id="name" placeholder="Ex: Maria" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {/* Apelido */}
      <div className="space-y-1.5">
        <Label htmlFor="nickname">Apelido</Label>
        <Input id="nickname" placeholder="Ex: Mãe, Pai, Filha..." {...register("nickname")} />
      </div>

      {/* Data de nascimento */}
      <div className="space-y-1.5">
        <Label htmlFor="birth_date">Data de nascimento</Label>
        <Input id="birth_date" type="date" {...register("birth_date")} />
      </div>

      {/* Cor */}
      <div className="space-y-2">
        <Label>Cor</Label>
        <div className="flex gap-2 flex-wrap">
          {MEMBER_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              title={c.label}
              onClick={() => setValue("color", c.value)}
              className="size-7 rounded-full transition-transform hover:scale-110 focus:outline-none"
              style={{
                backgroundColor: c.value,
                outline: selectedColor === c.value ? `2px solid ${c.value}` : "none",
                outlineOffset: "2px",
              }}
            />
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Salvando..." : member ? "Salvar alterações" : "Adicionar membro"}
      </Button>
    </form>
  );
}

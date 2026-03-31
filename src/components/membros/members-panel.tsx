"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MemberForm } from "./member-form";
import { deleteMember } from "@/lib/actions/members";
import { useMembers } from "@/hooks/use-members";
import type { FamilyMember } from "@/types/database";

function MemberAvatar({ member, size = "md" }: { member: FamilyMember; size?: "sm" | "md" | "lg" }) {
  const initials = member.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const sizeClass = size === "sm" ? "size-8 text-xs" : size === "lg" ? "size-14 text-xl" : "size-10 text-sm";

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center text-white font-bold shadow-sm shrink-0`}
      style={{ backgroundColor: member.color || "#78716c" }}
    >
      {initials}
    </div>
  );
}

function MemberCard({ member }: { member: FamilyMember }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-accent/30 transition-colors group">
      <MemberAvatar member={member} size="md" />

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm leading-tight truncate">{member.name}</p>
        {member.nickname && (
          <p className="text-xs text-muted-foreground truncate">{member.nickname}</p>
        )}
      </div>

      {/* Ações — aparecem no hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger render={<Button variant="ghost" size="icon" className="size-7" />}>
            <Pencil className="size-3.5" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar membro</DialogTitle>
            </DialogHeader>
            <MemberForm member={member} onSuccess={() => setEditOpen(false)} />
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" />}>
            <Trash2 className="size-3.5" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover membro?</AlertDialogTitle>
              <AlertDialogDescription>
                <strong>{member.name}</strong> será removido. Eventos vinculados a ele ficam sem responsável.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => deleteMember(member.id)}
              >
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export function MembersPanel() {
  const { members, loading } = useMembers();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-primary" />
          <h3 className="font-semibold">Membros da família</h3>
          {!loading && members.length > 0 && (
            <span className="text-xs text-muted-foreground">{members.length} membro{members.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="size-3.5" />
            Adicionar
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo membro</DialogTitle>
            </DialogHeader>
            <MemberForm onSuccess={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Conteúdo */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <Users className="size-10 mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">Nenhum membro cadastrado</p>
          <p className="text-xs text-muted-foreground mt-1">Adicione os membros da sua família para associar a eventos</p>
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((m) => <MemberCard key={m.id} member={m} />)}
        </div>
      )}
    </div>
  );
}

// Exporta o avatar para uso em outros componentes (ex: agenda)
export { MemberAvatar };

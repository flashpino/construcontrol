import { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import {
  Lightbulb, FileText, Calendar, User, MapPin,
  Edit, Trash2, X, Save, CheckCircle2, Clock,
  AlertCircle, XCircle, ExternalLink
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const STATUS_OPTIONS = [
  { value: 'pendente',     label: 'Pendente',     color: 'text-amber-600 bg-amber-50 border-amber-200',          Icon: Clock },
  { value: 'em_andamento', label: 'Em Andamento', color: 'text-blue-600 bg-blue-50 border-blue-200',             Icon: AlertCircle },
  { value: 'concluida',    label: 'Concluída',    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',     Icon: CheckCircle2 },
  { value: 'cancelada',    label: 'Cancelada',    color: 'text-red-500 bg-red-50 border-red-200',                Icon: XCircle },
];

function StatusBadge({ value }) {
  // Normaliza null/undefined para 'pendente'
  const resolved = value || 'pendente';
  const opt = STATUS_OPTIONS.find(s => s.value === resolved);
  if (!opt) return null;
  const { label, color, Icon } = opt;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${color}`}>
      <Icon size={10} />
      {label}
    </span>
  );
}

export default function AcoesComplementares({ registros_com_acoes }) {
  const [editingId, setEditingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('todos');

  const editForm = useForm({
    status_acao_complementar: '',
    observacoes_acao_complementar: '',
  });

  const startEditing = (registro) => {
    setEditingId(registro.id);
    editForm.setData({
      status_acao_complementar: registro.status_acao_complementar || 'pendente',
      observacoes_acao_complementar: registro.observacoes_acao_complementar || '',
    });
  };

  const handleUpdate = (id) => {
    const toastId = toast.loading('Atualizando status...');
    editForm.put(route('acoes-complementares.update', id), {
      onSuccess: () => {
        toast.dismiss(toastId);
        setEditingId(null);
      },
      onError: () => {
        toast.dismiss(toastId);
      },
    });
  };

  const handleDestroy = (id) => {
    if (!confirm('Remover esta ação complementar do registro? O RDO não será excluído.')) return;
    const toastId = toast.loading('Removendo ação...');
    router.delete(route('acoes-complementares.destroy', id), {
      onSuccess: () => {
        toast.dismiss(toastId);
      },
      onError: () => {
        toast.dismiss(toastId);
      }
    });
  };

  const lista = registros_com_acoes || [];

  // Counts for filter badges
  const counts = {
    todos: lista.length,
    pendente: lista.filter(r => !r.status_acao_complementar || r.status_acao_complementar === 'pendente').length,
    em_andamento: lista.filter(r => r.status_acao_complementar === 'em_andamento').length,
    concluida: lista.filter(r => r.status_acao_complementar === 'concluida').length,
    cancelada: lista.filter(r => r.status_acao_complementar === 'cancelada').length,
  };

  // Apply active filter
  const filtered = activeFilter === 'todos'
    ? lista
    : activeFilter === 'pendente'
      ? lista.filter(r => !r.status_acao_complementar || r.status_acao_complementar === 'pendente')
      : lista.filter(r => r.status_acao_complementar === activeFilter);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Ações Complementares
        </h2>
      }
    >
      <Head title="Ações Complementares" />

      <div className="py-12 bg-slate-50/50 min-h-screen">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Lightbulb size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Gestão</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
                Ações Complementares<span className="text-emerald-500">.</span>
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Acompanhe e gerencie as ações complementares registradas em campo.
              </p>
            </div>
          </div>

          {/* Filter badges */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('todos')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFilter === 'todos'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              Todos
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeFilter === 'todos' ? 'bg-white/20' : 'bg-slate-100'}`}>
                {counts.todos}
              </span>
            </button>

            {STATUS_OPTIONS.map(({ value, label, color, Icon }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === value
                    ? `${color} shadow-md ring-2 ring-offset-1 ring-slate-300`
                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon size={11} />
                {label}
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeFilter === value ? 'bg-white/40' : 'bg-slate-100'}`}>
                  {counts[value]}
                </span>
              </button>
            ))}
          </div>

          {/* Main card */}
          <Card className="rounded-3xl border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-lg font-black tracking-tight text-slate-900 uppercase italic">
                Registros com Ação Complementar
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium mt-1">
                {filtered.length} {filtered.length === 1 ? 'registro encontrado' : 'registros encontrados'}
                {activeFilter !== 'todos' && (
                  <button
                    onClick={() => setActiveFilter('todos')}
                    className="ml-3 text-amber-600 hover:text-amber-700 underline underline-offset-2"
                  >
                    limpar filtro
                  </button>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <FileText size={40} className="mb-4 text-slate-300" />
                  <p className="font-bold uppercase tracking-widest text-xs">Nenhum registro encontrado</p>
                  <p className="text-sm mt-1 text-slate-500 font-medium">
                    {activeFilter !== 'todos' ? 'Nenhuma ação com este status.' : 'As ações aparecerão aqui conforme forem registradas no RDO.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  <AnimatePresence initial={false}>
                    {filtered.map((registro) => (
                      <motion.div
                        key={registro.id}
                        layout
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="p-6 hover:bg-slate-50/60 transition-colors"
                      >
                        {editingId === registro.id ? (
                          /* ── Edit mode ── */
                          <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                                Editando RDO #{registro.id} — {new Date(registro.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setEditingId(null)}
                                className="h-8 w-8 rounded-xl text-slate-400 hover:text-slate-700"
                              >
                                <X size={14} />
                              </Button>
                            </div>

                            {/* Status selector */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Status da Ação</label>
                              <div className="flex flex-wrap gap-2">
                                {STATUS_OPTIONS.map(({ value, label, color, Icon }) => (
                                  <button
                                    key={value}
                                    type="button"
                                    onClick={() => editForm.setData('status_acao_complementar', value)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                      editForm.data.status_acao_complementar === value
                                        ? `${color} ring-2 ring-offset-1 ring-slate-400`
                                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                    }`}
                                  >
                                    <Icon size={11} /> {label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Observations */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Observações</label>
                              <Textarea
                                placeholder="Adicione observações sobre a ação complementar..."
                                value={editForm.data.observacoes_acao_complementar}
                                onChange={(e) => editForm.setData('observacoes_acao_complementar', e.target.value)}
                                className="rounded-2xl border-slate-200 bg-slate-50 min-h-[80px] font-medium"
                              />
                            </div>

                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="ghost"
                                onClick={() => setEditingId(null)}
                                className="rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-5"
                              >
                                Cancelar
                              </Button>
                              <Button
                                onClick={() => handleUpdate(registro.id)}
                                disabled={editForm.processing}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-6 shadow-lg shadow-emerald-500/20"
                              >
                                <Save size={13} className="mr-1.5" /> Salvar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          /* ── View mode ── */
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              {/* Metadata row */}
                              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                                <span className="flex items-center gap-1.5">
                                  <Calendar size={13} className="text-slate-400" />
                                  {new Date(registro.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <MapPin size={13} className="text-slate-400" />
                                  {registro.obra?.titulo_da_obra || registro.obra?.nome || 'N/D'}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <User size={13} className="text-slate-400" />
                                  {registro.usuario?.name || 'N/D'}
                                </span>
                              </div>

                              {/* Description */}
                              {registro.descricao_acao_complementar && (
                                <div className="flex items-start gap-2.5">
                                  <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg mt-0.5 shrink-0">
                                    <Lightbulb size={13} />
                                  </div>
                                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                    {registro.descricao_acao_complementar}
                                  </p>
                                </div>
                              )}

                              {/* Observations */}
                              {registro.observacoes_acao_complementar && (
                                <p className="text-xs text-slate-500 font-medium italic pl-8">
                                  {registro.observacoes_acao_complementar}
                                </p>
                              )}

                              <StatusBadge value={registro.status_acao_complementar} />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              {/* Ver RDO de origem */}
                              <Link href={route('registros.edit', registro.id)}>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-9 px-3 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 font-black uppercase tracking-widest text-[9px] gap-1.5"
                                  title="Ver RDO de origem"
                                >
                                  <ExternalLink size={13} />
                                  Ver RDO
                                </Button>
                              </Link>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => startEditing(registro)}
                                className="h-9 w-9 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                title="Editar"
                              >
                                <Edit size={15} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDestroy(registro.id)}
                                className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                                title="Remover ação"
                              >
                                <Trash2 size={15} />
                              </Button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </AuthenticatedLayout>
  );
}

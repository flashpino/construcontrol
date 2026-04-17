import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Trash2, Edit, Save, X, Lightbulb, FileText, Calendar, User, MapPin } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/Components/ui/select';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AcoesComplementares({ acoes, registros_com_acoes }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const addForm = useForm({
    nome: '',
    status: 'ativa'
  });

  const editForm = useForm({
    nome: '',
    status: 'ativa'
  });

  const handleAdd = (e) => {
    e.preventDefault();
    addForm.post(route('acoes-complementares.store'), {
      onSuccess: () => {
        toast.success('Ação criada');
        addForm.reset();
        setIsAdding(false);
      }
    });
  };

  const handleUpdate = (id) => {
    editForm.put(route('acoes-complementares.update', id), {
      onSuccess: () => {
        toast.success('Ação atualizada');
        setEditingId(null);
      }
    });
  };

  const handleDelete = (id) => {
    if (!confirm('Excluir esta ação complementar?')) return;
    router.delete(route('acoes-complementares.destroy', id), {
      onSuccess: () => toast.success('Ação excluída')
    });
  };

  const startEditing = (acao) => {
    setEditingId(acao.id);
    editForm.setData({
      nome: acao.nome,
      status: acao.status
    });
  };

  const acoesList = acoes || [];
  const registrosList = registros_com_acoes || [];

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
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Lightbulb size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Gestão</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">Ações Complementares<span className="text-emerald-500">.</span></h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Gerencie os tipos de ações e acompanhe as registradas em campo.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Coluna 1: CRUD das Opções (1/3 espaço em telas grandes) */}
            <div className="xl:col-span-1">
              <Card className="rounded-3xl border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
                <CardHeader className="p-8 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-black tracking-tight text-slate-900 uppercase italic">Tipos de Ação</CardTitle>
                      <CardDescription className="text-slate-500 font-medium mt-1 text-xs">Opções disponíveis no formulário de RDO.</CardDescription>
                    </div>
                    {!isAdding && (
                      <Button 
                        onClick={() => setIsAdding(true)}
                        size="icon"
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 w-10 shrink-0"
                      >
                        <Plus size={16} />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {isAdding && (
                        <motion.form 
                          onSubmit={handleAdd}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-3 mb-6"
                        >
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Descrição / Nome</label>
                            <Input 
                              placeholder="Ex: Treinamento adicional" 
                              value={addForm.data.nome}
                              onChange={(e) => addForm.setData('nome', e.target.value)}
                              className="h-10 rounded-xl border-slate-200 bg-white font-bold text-sm"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Status</label>
                            <Select value={addForm.data.status} onValueChange={(v) => addForm.setData('status', v)}>
                              <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white font-bold text-sm">
                                {addForm.data.status === 'ativa' ? 'Ativa' : 'Inativa'}
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ativa">Ativa</SelectItem>
                                <SelectItem value="inativa">Inativa</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button 
                              type="button"
                              variant="ghost" 
                              onClick={() => setIsAdding(false)}
                              className="flex-1 rounded-xl font-black uppercase tracking-widest text-[10px] h-10"
                            >
                              Cancelar
                            </Button>
                            <Button 
                              type="submit"
                              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-10 shadow-lg shadow-emerald-500/20"
                              disabled={addForm.processing}
                            >
                              Salvar
                            </Button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-col gap-3 font-primary">
                      {acoesList.map((acao) => (
                        <motion.div 
                          key={acao.id}
                          layout
                          className={`p-4 rounded-2xl border ${acao.status === 'ativa' ? 'border-emerald-100 bg-white' : 'border-slate-200 bg-slate-50 opacity-80'} shadow-sm hover:shadow-md transition-all group`}
                        >
                          {editingId === acao.id ? (
                            <div className="space-y-3">
                              <Input 
                                value={editForm.data.nome}
                                onChange={(e) => editForm.setData('nome', e.target.value)}
                                className="h-9 rounded-lg border-slate-200 font-bold text-sm"
                                required
                              />
                              <Select value={editForm.data.status} onValueChange={(v) => editForm.setData('status', v)}>
                                <SelectTrigger className="h-9 rounded-lg border-slate-200 text-sm">
                                  {editForm.data.status === 'ativa' ? 'Ativa' : 'Inativa'}
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ativa">Ativa</SelectItem>
                                  <SelectItem value="inativa">Inativa</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="flex gap-2 pt-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => setEditingId(null)}
                                  className="flex-1 rounded-lg font-black uppercase tracking-widest text-[9px] h-8"
                                >
                                  Cancelar
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleUpdate(acao.id)}
                                  className="flex-1 bg-slate-900 text-white rounded-lg font-black uppercase tracking-widest text-[9px] h-8"
                                  disabled={editForm.processing}
                                >
                                  Salvar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-slate-800 text-sm leading-tight">{acao.nome}</span>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${acao.status === 'ativa' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                  {acao.status === 'ativa' ? '• Ativa' : '• Inativa'}
                                </span>
                              </div>
                              <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => startEditing(acao)}
                                  className="h-7 w-7 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                >
                                  <Edit size={12} />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => handleDelete(acao.id)}
                                  className="h-7 w-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 size={12} />
                                </Button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {acoesList.length === 0 && (
                      <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Nenhuma ação cadastrada</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coluna 2: Relatório do que veio da RDO (2/3 espaço em telas grandes) */}
            <div className="xl:col-span-2">
              <Card className="rounded-3xl border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden bg-white h-full">
                <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-xl font-black tracking-tight text-slate-900 uppercase italic">Ações Registradas em RDO</CardTitle>
                  <CardDescription className="text-slate-500 font-medium mt-1">Listagem de todas as RDOs onde houve aplicação de ação complementar.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-50/80 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4">Data</th>
                          <th className="px-6 py-4">Ação / Descrição</th>
                          <th className="px-6 py-4">Obra</th>
                          <th className="px-6 py-4">Usuário</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrosList.length > 0 ? (
                          registrosList.map((registro) => {
                            // Convert string ID to parsed ID, or fallback to the text itself if it wasn't an ID
                            const actionDesc = registro.descricao_acao_complementar;
                            let actionDisplay = actionDesc;
                            
                            if (actionDesc) {
                              const foundAction = acoesList.find(a => a.id.toString() === actionDesc.toString());
                              if (foundAction) {
                                actionDisplay = foundAction.nome;
                              }
                            } else {
                              actionDisplay = "Não informada";
                            }

                            return (
                              <tr key={registro.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2 text-slate-600 font-medium font-mono text-xs">
                                    <Calendar size={14} className="text-slate-400" />
                                    {new Date(registro.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg shrink-0">
                                      <Lightbulb size={14} />
                                    </div>
                                    <span className="font-bold text-slate-800">{actionDisplay}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <MapPin size={14} className="text-slate-400 shrink-0" />
                                    <span className="truncate max-w-[150px]" title={registro.obra?.nome}>{registro.obra?.nome || 'N/D'}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <User size={14} className="text-slate-400 shrink-0" />
                                    <span>{registro.usuario?.name || 'N/D'}</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-6 py-16 text-center">
                              <div className="flex flex-col items-center justify-center text-slate-400">
                                <FileText size={32} className="mb-3 text-slate-300" />
                                <span className="font-bold uppercase tracking-widest text-xs">Nenhum registro encontrado</span>
                                <span className="text-sm mt-1 text-slate-500 font-medium">Nenhuma RDO teve ação complementar assinalada.</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

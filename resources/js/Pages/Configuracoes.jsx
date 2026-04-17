import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Users, 
  Tag, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  Palette,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Usuarios from './Usuarios';
import AcoesComplementares from './AcoesComplementares';

export default function Configuracoes({ statusOpcoes, usuarios, acoesComplementares }) {
  const [isAddingStatus, setIsAddingStatus] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState(null);
  
  const addStatusForm = useForm({
    nome: '',
    cor: '#64748b'
  });

  const editStatusForm = useForm({
    nome: '',
    cor: '#64748b'
  });

  const handleAddStatus = (e) => {
    e.preventDefault();
    addStatusForm.post(route('status-opcoes.store'), {
      onSuccess: () => {
        toast.success('Status criado');
        addStatusForm.reset();
        setIsAddingStatus(false);
      }
    });
  };

  const handleUpdateStatus = (id) => {
    editStatusForm.put(route('status-opcoes.update', id), {
      onSuccess: () => {
        toast.success('Status atualizado');
        setEditingStatusId(null);
      }
    });
  };

  const handleDeleteStatus = (id) => {
    if (!confirm('Excluir este status?')) return;
    router.delete(route('status-opcoes.destroy', id), {
      onSuccess: () => toast.success('Status excluído')
    });
  };

  const startEditing = (status) => {
    setEditingStatusId(status.id);
    editStatusForm.setData({
      nome: status.nome,
      cor: status.cor
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Configurações
        </h2>
      }
    >
      <Head title="Configurações" />

      <div className="py-12 bg-slate-50/50 min-h-screen">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <SettingsIcon size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Configurações do Sistema</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">Painel de Controle<span className="text-slate-400">.</span></h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Gerencie usuários, permissões e parâmetros globais.</p>
            </div>
          </div>

          <Tabs defaultValue="usuarios" className="w-full">
            <TabsList className="bg-slate-200/50 p-1.5 rounded-2xl mb-8 h-16 w-full md:w-auto inline-flex shadow-sm border border-slate-200">
              <TabsTrigger 
                value="usuarios" 
                className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] h-12"
              >
                <Users size={14} className="mr-2" /> Usuários
              </TabsTrigger>
              <TabsTrigger 
                value="status" 
                className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] h-12"
              >
                <Tag size={14} className="mr-2" /> Status de Registros
              </TabsTrigger>
              <TabsTrigger 
                value="acoes" 
                className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] h-12"
              >
                <Lightbulb size={14} className="mr-2" /> Ações Compl.
              </TabsTrigger>
            </TabsList>

            <TabsContent value="usuarios">
              <Usuarios usuarios={usuarios} />
            </TabsContent>

            <TabsContent value="status">
              <Card className="rounded-3xl border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
                <CardHeader className="p-8 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-black tracking-tight text-slate-900 uppercase italic">Opções de Status</CardTitle>
                      <CardDescription className="text-slate-500 font-medium mt-1">Defina os status disponíveis para os registros de campo.</CardDescription>
                    </div>
                    {!isAddingStatus && (
                      <Button 
                        onClick={() => setIsAddingStatus(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-4"
                      >
                        <Plus size={14} className="mr-2" /> Novo Status
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {isAddingStatus && (
                        <motion.form 
                          onSubmit={handleAddStatus}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-4 items-end mb-6"
                        >
                          <div className="flex-1 space-y-2 w-full">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome do Status</label>
                            <Input 
                              placeholder="Ex: Em andamento" 
                              value={addStatusForm.data.nome}
                              onChange={(e) => addStatusForm.setData('nome', e.target.value)}
                              className="h-12 rounded-xl border-slate-200 bg-white font-bold"
                              required
                            />
                          </div>
                          <div className="space-y-2 w-full md:w-48">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cor</label>
                            <div className="flex gap-2">
                              <Input 
                                type="color" 
                                value={addStatusForm.data.cor}
                                onChange={(e) => addStatusForm.setData('cor', e.target.value)}
                                className="h-12 w-12 p-1 rounded-xl border-slate-200 bg-white cursor-pointer"
                              />
                              <Input 
                                value={addStatusForm.data.cor}
                                onChange={(e) => addStatusForm.setData('cor', e.target.value)}
                                className="h-12 flex-1 rounded-xl border-slate-200 bg-white font-mono text-xs"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 w-full md:w-auto">
                            <Button 
                              type="button"
                              variant="ghost" 
                              onClick={() => setIsAddingStatus(false)}
                              className="flex-1 md:flex-none rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-6"
                            >
                              Cancelar
                            </Button>
                            <Button 
                              type="submit"
                              className="flex-1 md:flex-none bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-6 shadow-lg shadow-amber-500/20"
                              disabled={addStatusForm.processing}
                            >
                              Salvar
                            </Button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-primary">
                      {statusOpcoes.map((status) => (
                        <motion.div 
                          key={status.id}
                          layout
                          className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all group"
                        >
                          {editingStatusId === status.id ? (
                            <div className="space-y-4">
                              <Input 
                                value={editStatusForm.data.nome}
                                onChange={(e) => editStatusForm.setData('nome', e.target.value)}
                                className="h-10 rounded-lg border-slate-200 font-bold text-sm"
                                required
                              />
                              <div className="flex items-center gap-2">
                                <Input 
                                  type="color" 
                                  value={editStatusForm.data.cor}
                                  onChange={(e) => editStatusForm.setData('cor', e.target.value)}
                                  className="h-10 w-10 p-1 rounded-lg border-slate-200 cursor-pointer"
                                />
                                <Input 
                                  value={editStatusForm.data.cor}
                                  onChange={(e) => editStatusForm.setData('cor', e.target.value)}
                                  className="h-10 flex-1 rounded-lg border-slate-200 font-mono text-xs"
                                />
                              </div>
                              <div className="flex gap-2 pt-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => setEditingStatusId(null)}
                                  className="flex-1 rounded-lg font-black uppercase tracking-widest text-[9px] h-8"
                                >
                                  <X size={12} className="mr-1" /> Cancelar
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleUpdateStatus(status.id)}
                                  className="flex-1 bg-slate-900 text-white rounded-lg font-black uppercase tracking-widest text-[9px] h-8"
                                  disabled={editStatusForm.processing}
                                >
                                  <Save size={12} className="mr-1" /> Salvar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-3 h-3 rounded-full shadow-sm" 
                                  style={{ backgroundColor: status.cor }}
                                />
                                <span className="font-black uppercase tracking-widest text-xs text-slate-700">{status.nome}</span>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => startEditing(status)}
                                  className="h-8 w-8 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                                >
                                  <Edit size={14} />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => handleDeleteStatus(status.id)}
                                  className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {statusOpcoes.length === 0 && (
                      <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <Palette size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Nenhum status configurado</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="acoes">
              <AcoesComplementares acoes={acoesComplementares} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

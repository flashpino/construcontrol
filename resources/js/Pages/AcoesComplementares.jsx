import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, Trash2, Edit, Save, X, Lightbulb } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/Components/ui/select';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function AcoesComplementares({ acoes }) {
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

  // Convert array to fallback if undefined
  const acoesList = acoes || [];

  return (
    <Card className="rounded-3xl border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
      <CardHeader className="p-8 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black tracking-tight text-slate-900 uppercase italic">Ações Complementares</CardTitle>
            <CardDescription className="text-slate-500 font-medium mt-1">Defina as ações complementares pré-configuradas para o RDO.</CardDescription>
          </div>
          {!isAdding && (
            <Button 
              onClick={() => setIsAdding(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-4"
            >
              <Plus size={14} className="mr-2" /> Nova Ação
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isAdding && (
              <motion.form 
                onSubmit={handleAdd}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-4 items-end mb-6"
              >
                <div className="flex-1 space-y-2 w-full">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Descrição / Nome da Ação</label>
                  <Input 
                    placeholder="Ex: Treinamento adicional realizado" 
                    value={addForm.data.nome}
                    onChange={(e) => addForm.setData('nome', e.target.value)}
                    className="h-12 rounded-xl border-slate-200 bg-white font-bold"
                    required
                  />
                </div>
                <div className="space-y-2 w-full md:w-48">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Status</label>
                  <Select value={addForm.data.status} onValueChange={(v) => addForm.setData('status', v)}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white font-bold">
                      {addForm.data.status === 'ativa' ? 'Ativa' : 'Inativa'}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativa">Ativa</SelectItem>
                      <SelectItem value="inativa">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button 
                    type="button"
                    variant="ghost" 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 md:flex-none rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-6"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-6 shadow-lg shadow-emerald-500/20"
                    disabled={addForm.processing}
                  >
                    Salvar
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-primary">
            {acoesList.map((acao) => (
              <motion.div 
                key={acao.id}
                layout
                className={`p-5 rounded-2xl border ${acao.status === 'ativa' ? 'border-emerald-100 bg-white' : 'border-slate-200 bg-slate-50 opacity-80'} shadow-sm hover:shadow-md transition-all group`}
              >
                {editingId === acao.id ? (
                  <div className="space-y-4">
                    <Input 
                      value={editForm.data.nome}
                      onChange={(e) => editForm.setData('nome', e.target.value)}
                      className="h-10 rounded-lg border-slate-200 font-bold text-sm"
                      required
                    />
                    <Select value={editForm.data.status} onValueChange={(v) => editForm.setData('status', v)}>
                      <SelectTrigger className="h-10 rounded-lg border-slate-200 text-sm">
                        {editForm.data.status === 'ativa' ? 'Ativa' : 'Inativa'}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativa">Ativa</SelectItem>
                        <SelectItem value="inativa">Inativa</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setEditingId(null)}
                        className="flex-1 rounded-lg font-black uppercase tracking-widest text-[9px] h-8"
                      >
                        <X size={12} className="mr-1" /> Cancelar
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdate(acao.id)}
                        className="flex-1 bg-slate-900 text-white rounded-lg font-black uppercase tracking-widest text-[9px] h-8"
                        disabled={editForm.processing}
                      >
                        <Save size={12} className="mr-1" /> Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="font-black uppercase tracking-widest text-xs text-slate-700">{acao.nome}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${acao.status === 'ativa' ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {acao.status === 'ativa' ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => startEditing(acao)}
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDelete(acao.id)}
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

          {acoesList.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <Lightbulb size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Nenhuma ação cadastrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

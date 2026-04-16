import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
  HardHat, 
  Plus, 
  Trash2, 
  Edit2,
  Calendar
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/Components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from '@/Components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger
} from '@/Components/ui/select';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Obras({ obras }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingObra, setEditingObra] = useState(null);

  const { data, setData, post, put, processing, reset, errors } = useForm({
    titulo_da_obra: '',
    status: 'ativa',
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (editingObra) {
      put(route('obras.update', editingObra.id), {
        onSuccess: () => {
          setIsDialogOpen(false);
          setEditingObra(null);
          reset();
          toast.success('Obra atualizada com sucesso');
        },
      });
    } else {
      post(route('obras.store'), {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
          toast.success('Obra criada com sucesso');
        },
      });
    }
  };

  const handleDelete = (id) => {
    if (!confirm('Tem certeza que deseja excluir esta obra?')) return;
    router.delete(route('obras.destroy', id), {
      onSuccess: () => toast.success('Obra excluída'),
    });
  };

  const openEdit = (obra) => {
    setEditingObra(obra);
    setData({
      titulo_da_obra: obra.titulo_da_obra,
      status: obra.status,
    });
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingObra(null);
    reset();
    setIsDialogOpen(true);
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Obras
        </h2>
      }
    >
      <Head title="Obras" />

      <div className="py-12 bg-slate-50/50 min-h-screen">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <HardHat size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Gestão de Canteiros</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">Obras<span className="text-slate-400">.</span></h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Gerencie os canteiros de obras cadastrados no sistema.</p>
            </motion.div>
            <Button onClick={openCreate} className="bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-6 shadow-lg shadow-amber-500/20">
              <Plus size={16} className="mr-2" /> Nova Obra
            </Button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 border-b border-slate-100">
                  <TableHead className="w-[100px] text-[10px] font-black uppercase tracking-widest px-8 py-5 text-slate-400 text-center">ID</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest px-8 py-5 text-slate-400">Título da Obra</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest px-8 py-5 text-slate-400">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest px-8 py-5 text-slate-400">Criação</TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-widest px-8 py-5 text-slate-400">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {obras.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-20 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Nenhuma obra cadastrada.</TableCell></TableRow>
                ) : obras.map((obra, index) => (
                  <motion.tr 
                    key={obra.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                  >
                    <TableCell className="font-black text-slate-400 text-xs px-8 py-5 text-center">#{obra.id}</TableCell>
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-3 font-black text-slate-900 uppercase tracking-tight text-sm">
                        <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                          <HardHat size={14} className="text-amber-500" />
                        </div>
                        {obra.titulo_da_obra}
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        obra.status === 'ativa' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {obra.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                        <Calendar size={12} className="text-slate-400" />
                        {new Date(obra.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8 py-5">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(obra)} className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-950 hover:bg-slate-100 transition-all">
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(obra.id)} className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="p-0">
              <form onSubmit={handleSave}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic px-8 pt-8">{editingObra ? 'Editar Obra' : 'Nova Obra'}</DialogTitle>
                  <DialogDescription className="text-xs font-medium text-slate-500 px-8">
                    Preencha os dados abaixo para {editingObra ? 'atualizar' : 'cadastrar'} o canteiro de obras.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-6 px-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Título da Obra</label>
                    <Input 
                      placeholder="Ex: Edifício Horizonte" 
                      value={data.titulo_da_obra} 
                      onChange={(e) => setData('titulo_da_obra', e.target.value)} 
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold"
                      required
                    />
                    {errors.titulo_da_obra && <div className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.titulo_da_obra}</div>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Status do Canteiro</label>
                    <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                      <SelectTrigger>
                        {data.status === 'ativa' ? 'Ativa' : 'Inativa'}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativa">Ativa</SelectItem>
                        <SelectItem value="inativa">Inativa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-6">Cancelar</Button>
                  <Button type="submit" disabled={processing} className="bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-8 shadow-lg shadow-slate-950/20">
                    {editingObra ? 'Atualizar Obra' : 'Salvar Obra'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

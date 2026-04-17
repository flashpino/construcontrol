import { useState } from 'react';
import { Plus, Edit2, Trash2, User, Shield, Calendar, Key } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
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
import { useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Usuarios({ usuarios }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    username: '',
    password: '',
    role: 'usuario',
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (editingUser) {
      put(route('users.update', editingUser.id), {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        }
      });
    } else {
      post(route('users.store'), {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        }
      });
    }
  };

  const handleDelete = (id) => {
    if (!confirm('Excluir este usuário?')) return;
    router.delete(route('users.destroy', id));
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setData({
      name: user.name,
      username: user.username,
      password: '',
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingUser(null);
    reset();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Shield size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Controle de Acessos</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">Usuários<span className="text-slate-400">.</span></h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Gerencie os usuários e permissões de acesso ao sistema.</p>
        </div>
        <Button onClick={openCreate} className="bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-6 shadow-lg shadow-amber-500/20">
          <Plus size={16} className="mr-2" /> Novo Usuário
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 border-b border-slate-100">
              <TableHead className="w-[100px] text-[10px] font-black uppercase tracking-widest px-8 py-5 text-slate-900">ID</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest px-8 py-5 text-slate-900">Nome de Usuário</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest px-8 py-5 text-slate-900">Permissão</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest px-8 py-5 text-slate-900">Cadastro</TableHead>
              <TableHead className="text-right text-[10px] font-black uppercase tracking-widest px-8 py-5 text-slate-900">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Nenhum usuário cadastrado.</TableCell></TableRow>
            ) : usuarios.map((user, index) => (
              <motion.tr 
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
              >
                <TableCell className="font-black text-slate-400 text-xs px-8 py-5">#{user.id}</TableCell>
                <TableCell className="px-8 py-5">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-3 font-black text-slate-900 uppercase tracking-tight text-sm">
                      <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                        <User size={14} className="text-slate-400" />
                      </div>
                      {user.name}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 ml-11">@{user.username}</span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                  }`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className="px-8 py-5">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <Calendar size={12} className="text-slate-400" />
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </TableCell>
                <TableCell className="text-right px-8 py-5">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(user)} className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-950 hover:bg-slate-100 transition-all">
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
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
        <DialogContent className="rounded-3xl border-slate-200 p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-500">
              Gerencie as credenciais e o nível de acesso do usuário.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 py-6 font-primary">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</label>
              <Input 
                placeholder="Ex: João da Silva" 
                value={data.name} 
                onChange={(e) => setData('name', e.target.value)} 
                className="h-12 rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold"
              />
              {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome de Usuário</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Ex: joao_silva" 
                  value={data.username} 
                  onChange={(e) => setData('username', e.target.value)} 
                  className="h-12 pl-11 rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold"
                />
              </div>
              {errors.username && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.username}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Senha {editingUser && <span className="text-amber-500">(opcional)</span>}
              </label>
              <div className="relative">
                <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  type="password"
                  placeholder="******" 
                  value={data.password} 
                  onChange={(e) => setData('password', e.target.value)} 
                  className="h-12 pl-11 rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold"
                />
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.password}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nível de Acesso</label>
              <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold">
                  {data.role === 'admin' ? 'Administrador (Total)' : 'Usuário (Registros)'}
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200">
                  <SelectItem value="admin">Administrador (Total)</SelectItem>
                  <SelectItem value="usuario">Usuário (Registros)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-6">Cancelar</Button>
              <Button type="submit" disabled={processing} className="bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-8 shadow-lg shadow-slate-950/20">Salvar Usuário</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

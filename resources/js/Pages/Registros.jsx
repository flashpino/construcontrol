import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  HardHat, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Edit, 
  Filter, 
  ClipboardList 
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent } from '@/Components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger
} from '@/Components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function Registros({ registros, obras, statusOpcoes, auth, filters: initialFilters }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    obra_id: initialFilters.obra_id || '',
    data_inicio: initialFilters.data_inicio || '',
    data_fim: initialFilters.data_fim || '',
    status: initialFilters.status || ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value === 'all' ? '' : value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    router.visit(route('registros.index', filters), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Diário de Campo
        </h2>
      }
    >
      <Head title="RDO" />

      <div className="py-12 bg-slate-50/50 min-h-screen">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <ClipboardList size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Diário de Campo</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">RDO<span className="text-slate-400">.</span></h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Acompanhamento detalhado das atividades em campo.</p>
            </motion.div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className={`rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-5 border-slate-200 transition-all ${showFilters ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-600'}`}
              >
                <Filter size={14} className="mr-2" /> {showFilters ? 'Ocultar Filtros' : 'Filtrar'}
              </Button>
              <Link href={route('registros.create')}>
                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-6 shadow-lg shadow-amber-500/20">
                  <Plus size={16} className="mr-2" /> Novo RDO
                </Button>
              </Link>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="border border-slate-200 shadow-sm rounded-3xl bg-white mb-8">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Obra</label>
                        <Select value={filters.obra_id} onValueChange={(v) => handleFilterChange('obra_id', v)}>
                          <SelectTrigger>
                            {filters.obra_id ? obras.find(o => String(o.id) === String(filters.obra_id))?.titulo_da_obra : 'Todas as Obras'}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas as Obras</SelectItem>
                            {obras.map(o => (
                              <SelectItem key={o.id} value={String(o.id)}>{o.titulo_da_obra}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Início</label>
                        <Input 
                          type="date" 
                          className="h-12 rounded-2xl bg-slate-50 border-slate-200 text-xs font-bold" 
                          value={filters.data_inicio}
                          onChange={(e) => handleFilterChange('data_inicio', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Fim</label>
                        <Input 
                          type="date" 
                          className="h-12 rounded-2xl bg-slate-50 border-slate-200 text-xs font-bold" 
                          value={filters.data_fim}
                          onChange={(e) => handleFilterChange('data_fim', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                        <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                          <SelectTrigger>
                            {filters.status ? filters.status : 'Todos os Status'}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os Status</SelectItem>
                            {statusOpcoes.map(s => (
                              <SelectItem key={s.id} value={s.nome}>{s.nome}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                      <Button onClick={applyFilters} className="bg-slate-950 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-8">
                        <Search size={14} className="mr-2" /> Aplicar Filtros
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            {registros.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                <ClipboardList size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-xs font-black uppercase tracking-widest">Nenhum RDO encontrado.</p>
              </div>
            ) : registros.map((reg, index) => (
              <motion.div
                key={reg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border border-slate-200 shadow-sm rounded-3xl overflow-hidden hover:shadow-xl hover:border-amber-500/30 transition-all duration-500 group">
                  <div className="flex flex-col lg:flex-row">
                    <div className="p-8 flex-1 space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            reg.status === 'Normal' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                            reg.status === 'Atrasado' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            reg.status === 'Paralisado' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {reg.status}
                          </span>
                          <div className="flex items-center gap-2 text-slate-900 text-xs font-black uppercase tracking-tight">
                            <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
                              <HardHat size={12} className="text-amber-500" />
                            </div>
                            {reg.obra?.titulo_da_obra}
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <Calendar size={12} />
                            {new Date(reg.data).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <User size={12} />
                            {reg.usuario?.name || reg.usuario?.username}
                          </div>
                        </div>

                        {(auth.user.role === 'admin' || auth.user.id === reg.usuario_id) && (
                          <div className="flex gap-2">
                             {/* Delete butto logic can be added here or in detail view */}
                             <Button onClick={() => router.delete(route('registros.destroy', reg.id))} variant="ghost" size="sm" className="rounded-xl h-9 px-4 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all">
                                <Trash2 size={14} className="mr-2" /> Excluir
                             </Button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Atividade Realizada</h4>
                        <p className="text-slate-700 text-sm leading-relaxed font-medium">{reg.descricao_atividade}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reg.problemas_observacoes && (
                          <div className="space-y-2 p-4 bg-red-50/50 rounded-2xl border border-red-100">
                            <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                              <AlertCircle size={14} /> Problemas / Observações
                            </h4>
                            <p className="text-red-700 text-xs font-bold leading-tight">{reg.problemas_observacoes}</p>
                          </div>
                        )}

                        {reg.acao_complementar == 1 && (
                          <div className="space-y-2 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                              <CheckCircle2 size={14} /> Ação Complementar
                            </h4>
                            <p className="text-emerald-700 text-xs font-bold leading-tight">{reg.descricao_acao_complementar}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {reg.fotos && reg.fotos.length > 0 && (
                      <div className="lg:w-80 bg-slate-50/50 p-6 border-t lg:border-t-0 lg:border-l border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <ImageIcon size={14} /> Galeria de Fotos ({reg.fotos.length})
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {reg.fotos.map((foto) => (
                            <a 
                              key={foto.id} 
                              href={foto.caminho_arquivo} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="aspect-square rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-500 hover:scale-105 transition-all duration-300 shadow-sm"
                            >
                              <img src={foto.caminho_arquivo} alt="Foto da obra" className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { 
  FileText, 
  Search, 
  Calendar, 
  User, 
  HardHat, 
  Image as ImageIcon, 
  Printer,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger
} from '@/Components/ui/select';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

export default function Relatorios({ registros, obras, usuarios, statusOpcoes, auth, filters: initialFilters }) {
  const [filters, setFilters] = useState({
    obra_id: initialFilters.obra_id || '',
    usuario_id: initialFilters.usuario_id || '',
    data_inicio: initialFilters.data_inicio || '',
    data_fim: initialFilters.data_fim || '',
    status: initialFilters.status || ''
  });
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value === 'all' ? '' : value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    router.visit(route('registros.relatorios', filters), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleExport = async () => {
    if (!reportRef.current || registros.length === 0) {
      toast.error('Gere um relatório com registros primeiro.');
      return;
    }

    setIsExporting(true);
    const toastId = toast.loading('Gerando PDF... Aguarde.');

    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true, // Crucial for external images (S3/Cloudinary)
        logging: false,
        windowWidth: 1200, // Fixed width for consistent layout
        ignoreElements: (el) => el.classList.contains('no-export')
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgFinalWidth = imgWidth * ratio;
      const imgFinalHeight = imgHeight * ratio;
      
      // Handle multi-page if necessary
      let heightLeft = imgFinalHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgFinalWidth, imgFinalHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgFinalHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgFinalWidth, imgFinalHeight);
        heightLeft -= pdfHeight;
      }

      const fileName = `Relatorio-ConstruControl-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.dismiss(toastId);
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast.dismiss(toastId);
      toast.error('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Relatórios Gerenciais
        </h2>
      }
    >
      <Head title="Relatórios" />

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; }
          .mx-auto { max-width: 100% !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .py-12 { padding: 0 !important; }
          .shadow-sm, .shadow-xl { box-shadow: none !important; border: 1px solid #eee !important; }
          .rounded-3xl { border-radius: 0 !important; }
          .grid { display: block !important; }
          .lg\\:w-80 { width: 100% !important; border-left: none !important; border-top: 1px solid #eee !important; margin-top: 20px !important; }
        }
      `}} />

      <div className="py-12 bg-slate-50/50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <FileText size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Centro de Relatórios</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">Relatórios<span className="text-slate-400">.</span></h2>
            </motion.div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleExport} 
                disabled={isExporting || registros.length === 0}
                variant="outline" 
                className="rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-6 border-slate-200 bg-white hover:bg-blue-50 hover:text-blue-600 transition-all border-2 disabled:opacity-50"
              >
                {isExporting ? (
                  <>Gerando...</>
                ) : (
                  <>
                    <Download size={16} className="mr-2" /> Exportar PDF
                  </>
                )}
              </Button>
            </div>
          </div>

          <Card className="border border-slate-200 shadow-sm rounded-3xl bg-white no-print">
            <CardHeader className="border-b border-slate-100 p-8 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                  <Filter size={18} className="text-blue-600" />
                </div>
                <CardTitle className="text-[10px] font-black uppercase tracking-widest">Filtros Avançados</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
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

                {auth.user.role === 'admin' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Colaborador</label>
                    <Select value={filters.usuario_id} onValueChange={(v) => handleFilterChange('usuario_id', v)}>
                      <SelectTrigger>
                        {filters.usuario_id ? usuarios.find(u => String(u.id) === String(filters.usuario_id))?.name : 'Todos os Usuários'}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Usuários</SelectItem>
                        {usuarios.map(u => (
                          <SelectItem key={u.id} value={String(u.id)}>{u.name || u.username}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

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

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Inicial</label>
                  <Input 
                    type="date" 
                    className="h-12 rounded-2xl bg-slate-50" 
                    value={filters.data_inicio}
                    onChange={(e) => handleFilterChange('data_inicio', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Final</label>
                  <Input 
                    type="date" 
                    className="h-12 rounded-2xl bg-slate-50" 
                    value={filters.data_fim}
                    onChange={(e) => handleFilterChange('data_fim', e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={applyFilters} className="bg-slate-950 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-8">
                  Gerar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-12" ref={reportRef}>
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total de Registros: {registros.length}</span>
            </div>

            {registros.map((reg) => (
              <div key={reg.id} className="bg-white border p-12 rounded-[40px] shadow-sm break-inside-avoid">
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-8 border-b pb-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        reg.status === 'Normal' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {reg.status}
                      </span>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">{reg.obra?.titulo_da_obra}</h3>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Calendar size={14} className="text-blue-500" /> {new Date(reg.data).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <User size={14} className="text-blue-500" /> {reg.usuario?.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID do Registro</p>
                    <p className="text-lg font-mono font-bold text-slate-300">#RDO-{String(reg.id).padStart(5, '0')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-12">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Atividades Realizadas</h4>
                    <p className="text-slate-800 text-lg leading-relaxed font-medium whitespace-pre-wrap">{reg.descricao_atividade}</p>
                  </div>

                  {reg.problemas_observacoes && (
                    <div className="space-y-3 bg-red-50 p-8 rounded-3xl border border-red-100">
                      <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle size={14} /> Problemas / Observações
                      </h4>
                      <p className="text-red-900 text-sm font-bold leading-relaxed">{reg.problemas_observacoes}</p>
                    </div>
                  )}

                  {reg.acao_complementar == 1 && (
                    <div className="space-y-3 bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
                      <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 size={14} /> Ação Complementar
                      </h4>
                      <p className="text-emerald-900 text-sm font-bold leading-relaxed">{reg.descricao_acao_complementar}</p>
                    </div>
                  )}

                  {reg.fotos && reg.fotos.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] no-print">Registro Fotográfico ({reg.fotos.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {reg.fotos.map((foto) => (
                          <div key={foto.id} className="aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                            <img src={foto.caminho_arquivo} alt="Foto RDO" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

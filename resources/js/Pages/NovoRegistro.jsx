import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Camera, 
  X, 
  Trash2, 
  ClipboardList, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  ImageIcon 
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger
} from '@/Components/ui/select';
import { Checkbox } from '@/Components/ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/Components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function NovoRegistro({ registro, obras, statusOpcoes }) {
  const isEditing = !!registro;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [fotosToRemove, setFotosToRemove] = useState([]);

  const { data, setData, post, processing, errors, reset } = useForm({
    obra_id: registro?.obra_id ? String(registro.obra_id) : '',
    data: registro?.data || new Date().toISOString().split('T')[0],
    status: registro?.status || '',
    descricao_atividade: registro?.descricao_atividade || '',
    problemas_observacoes: registro?.problemas_observacoes || '',
    acao_complementar: registro?.acao_complementar == 1,
    descricao_acao_complementar: registro?.descricao_acao_complementar || '',
    fotos: [],
    remove_fotos: '',
    _method: isEditing ? 'PUT' : 'POST',
  });

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }, 'image/jpeg', 0.7);
        };
      };
    });
  };

  const handleFileChange = async (e) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      toast.info(`Compactando ${filesArr.length} foto(s)...`, { duration: 2000 });
      
      const compressedFiles = await Promise.all(
        filesArr.map(file => compressImage(file))
      );

      setData('fotos', [...data.fotos, ...compressedFiles]);
      
      const newPreviews = compressedFiles.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
      
      toast.success('Fotos prontas para envio!');
    }
  };

  const removeFoto = (index) => {
    const newFotos = [...data.fotos];
    newFotos.splice(index, 1);
    setData('fotos', newFotos);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const toggleRemoveExistingFoto = (fotoId) => {
    let newRemoveList;
    if (fotosToRemove.includes(fotoId)) {
      newRemoveList = fotosToRemove.filter(fid => fid !== fotoId);
    } else {
      newRemoveList = [...fotosToRemove, fotoId];
    }
    setFotosToRemove(newRemoveList);
    setData('remove_fotos', JSON.stringify(newRemoveList));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isEditing ? route('registros.update', registro.id) : route('registros.store');
    
    post(url, {
      onSuccess: () => {
        toast.success(isEditing ? 'Registro atualizado!' : 'Registro salvo!');
      },
      onError: (err) => {
        console.error(err);
        toast.error('Erro ao salvar registro. Verifique os campos.');
      }
    });
  };

  const handleDelete = () => {
    router.delete(route('registros.destroy', registro.id), {
      onSuccess: () => {
        toast.success('Registro excluído');
        setShowDeleteDialog(false);
      }
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {isEditing ? 'Editar RDO' : 'Novo RDO'}
        </h2>
      }
    >
      <Head title={isEditing ? 'Editar RDO' : 'Novo RDO'} />

      <div className="py-12 bg-slate-50/50 min-h-screen">
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="p-0">
            <DialogHeader className="px-8 pt-8">
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic text-red-600">Confirmar Exclusão</DialogTitle>
              <DialogDescription className="text-xs font-medium text-slate-500">
                Tem certeza que deseja excluir este registro? Esta ação removerá permanentemente todos os dados e fotos.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="px-8 pb-8">
              <Button variant="ghost" onClick={() => setShowDeleteDialog(false)} className="rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-6">Cancelar</Button>
              <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-8 shadow-lg shadow-red-600/20">Sim, Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link href={route('registros.index')}>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-white border border-transparent hover:border-slate-200 transition-all shadow-sm">
                  <ArrowLeft size={24} className="text-slate-600" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2 text-amber-600 mb-1">
                  <ClipboardList size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Formulário de Campo</span>
                </div>
                <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
                  {isEditing ? 'Editar' : 'Novo'} RDO<span className="text-slate-400">.</span>
                </h2>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="border border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                      <Info size={18} className="text-amber-500" />
                    </div>
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Informações Gerais</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Obra / Canteiro</label>
                      <Select 
                        value={data.obra_id} 
                        onValueChange={(v) => setData('obra_id', v)}
                      >
                        <SelectTrigger>
                          {data.obra_id ? obras.find(o => String(o.id) === String(data.obra_id))?.titulo_da_obra : 'Selecione a obra'}
                        </SelectTrigger>
                        <SelectContent>
                          {obras.map(o => (
                            <SelectItem key={o.id} value={String(o.id)}>{o.titulo_da_obra}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.obra_id && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.obra_id}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Data do Registro</label>
                      <Input 
                        type="date" 
                        value={data.data} 
                        onChange={(e) => setData('data', e.target.value)} 
                        required 
                        className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Status das Atividades</label>
                    <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                      <SelectTrigger>
                        {data.status || 'Selecione o status'}
                      </SelectTrigger>
                      <SelectContent>
                        {statusOpcoes.map((s) => (
                          <SelectItem key={s.id} value={s.nome}>{s.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Atividades Realizadas</label>
                    <Textarea 
                      placeholder="Descreva detalhadamente o que foi executado hoje..." 
                      className="min-h-[160px] rounded-3xl border-slate-200 bg-slate-50 p-6 font-medium"
                      value={data.descricao_atividade}
                      onChange={(e) => setData('descricao_atividade', e.target.value)}
                      required
                    />
                    {errors.descricao_atividade && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.descricao_atividade}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                      <AlertCircle size={12} className="text-red-500" /> Problemas ou Observações (opcional)
                    </label>
                    <Textarea 
                      placeholder="Relate imprevistos, falta de material, condições climáticas, etc." 
                      className="min-h-[100px] rounded-3xl border-slate-200 bg-slate-50 p-6 font-medium"
                      value={data.problemas_observacoes}
                      onChange={(e) => setData('problemas_observacoes', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    </div>
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Ações Complementares</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                    <Checkbox 
                      id="acao" 
                      checked={data.acao_complementar} 
                      onCheckedChange={(checked) => setData('acao_complementar', checked)} 
                    />
                    <label htmlFor="acao" className="text-xs font-black uppercase tracking-widest text-slate-700 cursor-pointer flex-1">
                      Houve necessidade de ação complementar?
                    </label>
                  </div>

                  <AnimatePresence>
                    {data.acao_complementar && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Descrição da Ação Tomada</label>
                        <Textarea 
                          placeholder="Descreva qual foi a ação tomada..." 
                          value={data.descricao_acao_complementar}
                          onChange={(e) => setData('descricao_acao_complementar', e.target.value)}
                          required
                          className="min-h-[100px] rounded-3xl border-slate-200 bg-slate-50 p-6 font-medium"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="border border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                      <ImageIcon size={18} className="text-blue-500" />
                    </div>
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Galeria de Fotos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  {isEditing && registro?.fotos?.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Fotos Salvas</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {registro.fotos.map((foto) => (
                          <div key={foto.id} className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${fotosToRemove.includes(foto.id) ? 'border-red-500 opacity-40 scale-95' : 'border-slate-100'}`}>
                            <img src={foto.caminho_arquivo} alt="Existente" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => toggleRemoveExistingFoto(foto.id)}
                              className={`absolute top-2 right-2 p-2 rounded-xl shadow-lg transition-all ${fotosToRemove.includes(foto.id) ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
                            >
                              {fotosToRemove.includes(foto.id) ? <ArrowLeft size={14} /> : <Trash2 size={14} />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Novos Uploads</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {previews.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm">
                          <img src={url} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => removeFoto(i)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 shadow-lg transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <label className="aspect-square rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 hover:border-amber-500 hover:text-amber-500 transition-all text-slate-400 group">
                        <Camera size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-center px-2">Adicionar Fotos</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 h-14 rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-amber-500/20 transition-all"
                  disabled={processing}
                >
                  <div className="flex items-center gap-2">
                    <Save size={18} />
                    <span>{isEditing ? 'Atualizar RDO' : 'Finalizar RDO'}</span>
                  </div>
                </Button>

                {isEditing && (
                  <Button 
                    type="button" 
                    variant="ghost"
                    onClick={() => setShowDeleteDialog(true)}
                    className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 h-14 rounded-3xl font-black uppercase tracking-widest text-[10px] transition-all"
                  >
                    <Trash2 size={18} className="mr-2" /> Excluir RDO
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

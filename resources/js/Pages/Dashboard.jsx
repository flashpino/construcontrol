import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { 
  HardHat, 
  ClipboardList, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#0f172a', '#f59e0b', '#10b981', '#ef4444', '#64748b'];

export default function Dashboard({ dashboardData, period }) {
  const periods = [
    { id: 'total', label: 'Tudo' },
    { id: 'hoje', label: 'Hoje' },
    { id: 'semana', label: 'Semana' },
    { id: 'mes', label: 'Mês' }
  ];

  const handlePeriodChange = (newPeriod) => {
    router.visit(route('dashboard', { period: newPeriod }), {
      preserveState: true,
      preserveScroll: true,
      only: ['dashboardData', 'period']
    });
  };

  const stats = [
    { name: 'Obras Ativas', value: dashboardData.totalObrasAtivas, icon: HardHat, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { name: 'Total de RDOs', value: dashboardData.totalRegistros, icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { name: 'Problemas Reportados', value: dashboardData.problemasReportados, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
    { name: 'Taxa Ação Comp.', value: `${dashboardData.taxaAcaoComplementar.toFixed(1)}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  ];

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Painel de Controle
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-12 bg-slate-50/50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Calendar size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Visão Geral</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">Dashboard<span className="text-slate-400">.</span></h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Bem-vindo ao centro de comando da ConstruControl.</p>
            </div>
            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm relative">
              {periods.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePeriodChange(p.id)}
                  className={`relative px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl ${
                    period === p.id 
                      ? 'text-white' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {period === p.id && (
                    <motion.div
                      layoutId="activePeriod"
                      className="absolute inset-0 bg-slate-950 rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{p.label}</span>
                </button>
              ))}
            </div>
          </header>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border ${stat.border} shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all duration-300`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.name}</CardTitle>
                    <div className={`${stat.bg} ${stat.color} p-2 rounded-xl group-hover:scale-110 transition-transform`}>
                      <stat.icon size={18} />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex items-end justify-between">
                      <div className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                      <div className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mb-1">
                        <ArrowUpRight size={10} className="mr-0.5" /> 0%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-1 border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-900">RDOs por Status</CardTitle>
              </CardHeader>
              <CardContent className="h-[320px] pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.registrosPorStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="status"
                      stroke="none"
                    >
                      {dashboardData.registrosPorStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-900">Obras mais Ativas</CardTitle>
              </CardHeader>
              <CardContent className="h-[320px] pt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.obrasMaisAtivas} layout="vertical" margin={{ left: 20, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="titulo_da_obra" type="category" width={140} fontSize={10} fontWeight="900" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                    />
                    <Bar dataKey="count" fill="#f59e0b" radius={[0, 8, 8, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-900">Usuários mais Ativos</CardTitle>
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-amber-700 hover:bg-amber-50">Ver Todos</Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {dashboardData.usuariosMaisAtivos.map((u, i) => (
                  <div key={u.username} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
                      <Users size={20} className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1.5 items-end">
                        <p className="text-xs font-black uppercase tracking-wide text-slate-900">{u.username}</p>
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{u.count} RDOs</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ 
                             width: dashboardData.usuariosMaisAtivos[0]?.count > 0 
                               ? `${(u.count / dashboardData.usuariosMaisAtivos[0].count) * 100}%` 
                               : '0%' 
                          }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="bg-slate-950 h-full rounded-full" 
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

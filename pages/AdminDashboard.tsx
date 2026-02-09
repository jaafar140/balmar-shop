import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, AlertTriangle, Package, CheckCircle } from 'lucide-react';

const DATA_LITIGES = [
  { name: 'Jan', value: 4 },
  { name: 'Fev', value: 3 },
  { name: 'Mar', value: 6 },
  { name: 'Avr', value: 2 },
  { name: 'Mai', value: 1 },
];

const DATA_PAYMENTS = [
  { name: 'COD', value: 60 },
  { name: 'Carte (Escrow)', value: 40 },
];

const COLORS = ['#d97706', '#0f4c81']; // Ochre, Majorelle

export const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-sand min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de Bord Admin</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
             <Package className="w-4 h-4" />
             <span>Transactions</span>
           </div>
           <p className="text-2xl font-bold text-gray-900">1,245</p>
           <span className="text-green-500 text-xs font-medium">+12% ce mois</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
             <AlertTriangle className="w-4 h-4" />
             <span>Taux Litiges</span>
           </div>
           <p className="text-2xl font-bold text-gray-900">1.8%</p>
           <span className="text-green-500 text-xs font-medium">Objectif &lt; 2%</span>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 text-sm">Évolution des Litiges</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA_LITIGES}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="#c2410c" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 text-sm">Répartition Paiements</h3>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DATA_PAYMENTS}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DATA_PAYMENTS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
               {DATA_PAYMENTS.map((entry, index) => (
                 <div key={index} className="flex items-center gap-2 text-xs">
                   <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                   <span className="text-gray-600">{entry.name} ({entry.value}%)</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
           <h3 className="font-bold text-gray-800 text-sm">Vérifications KYC récentes</h3>
           <button className="text-majorelle text-xs font-bold">Voir tout</button>
        </div>
        <div>
           {[1,2,3].map(i => (
             <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gray-200" />
                 <div>
                   <p className="text-sm font-medium text-gray-900">User_{100+i}</p>
                   <p className="text-[10px] text-gray-500">ID soumis via Jumio</p>
                 </div>
               </div>
               <div className="flex gap-2">
                 <button className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100"><CheckCircle className="w-4 h-4"/></button>
                 <button className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100"><AlertTriangle className="w-4 h-4"/></button>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
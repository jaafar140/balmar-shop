
import React from 'react';
import { Package, Truck, CheckCircle, Printer } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MySales: React.FC = () => {
  const { user } = useAuth();
  // Mock Sales
  const sales = [
    { id: 'tx_99', product: 'Caftan Vert Royal', price: 1200, buyer: 'Sofia K.', buyerAddress: '12 Rue des Iris, Maarif, Casablanca', status: 'A_EXPEDIER', date: 'Aujourd\'hui' },
    { id: 'tx_88', product: 'Sac Cuir', price: 400, buyer: 'Amine B.', buyerAddress: 'Rabat Agdal', status: 'EN_COURS', date: 'Hier' },
  ];

  const handlePrintLabel = (sale: any) => {
      const labelWindow = window.open('', '', 'width=600,height=600');
      if (labelWindow) {
          labelWindow.document.write(`
            <html>
              <head>
                <title>Bordereau BalMar</title>
                <style>
                  body { font-family: 'Courier New', monospace; padding: 20px; }
                  .label { border: 2px solid #000; padding: 20px; max-width: 400px; margin: 0 auto; }
                  .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                  .barcode { background: #000; height: 50px; width: 100%; margin: 20px 0; }
                  .row { margin-bottom: 15px; }
                  .bold { font-weight: bold; }
                </style>
              </head>
              <body>
                <div class="label">
                  <div class="header">
                    <h1>BalMar Express</h1>
                    <p>Standard Shipping</p>
                  </div>
                  <div class="row">
                    <span class="bold">FROM:</span><br>
                    ${user?.name}<br>
                    ${user?.location}
                  </div>
                  <div class="row">
                    <span class="bold">TO:</span><br>
                    ${sale.buyer}<br>
                    ${sale.buyerAddress}
                  </div>
                  <div class="barcode"></div>
                  <div class="row" style="text-align:center;">
                    MA-${Math.floor(Math.random()*100000)}-XJ
                  </div>
                  <hr>
                  <div class="row">
                    Item: ${sale.product}<br>
                    Weight: 0.5kg
                  </div>
                </div>
                <script>window.print();</script>
              </body>
            </html>
          `);
          labelWindow.document.close();
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <h1 className="text-2xl font-bold text-gray-900">Mes Ventes</h1>

      <div className="space-y-4">
        {sales.map(sale => (
          <div key={sale.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
             <div className="w-12 h-12 bg-blue-50 text-majorelle rounded-full flex items-center justify-center shrink-0">
               <Package className="w-6 h-6" />
             </div>
             
             <div className="flex-1 text-center md:text-left">
               <h3 className="font-bold text-gray-900">{sale.product}</h3>
               <p className="text-sm text-gray-500">Acheté par {sale.buyer} • {sale.date}</p>
             </div>

             <div className="font-bold text-majorelle text-lg">{sale.price} MAD</div>

             <div className="w-full md:w-auto">
               {sale.status === 'A_EXPEDIER' ? (
                 <button 
                   onClick={() => handlePrintLabel(sale)}
                   className="w-full px-6 py-3 bg-majorelle text-white rounded-xl font-bold hover:bg-blue-800 transition shadow-md flex items-center justify-center gap-2"
                 >
                   <Printer className="w-4 h-4"/>
                   Imprimer Bordereau
                 </button>
               ) : (
                 <button className="w-full px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold flex items-center justify-center gap-2 cursor-default">
                   <CheckCircle className="w-4 h-4"/>
                   En transit
                 </button>
               )}
             </div>
          </div>
        ))}

        {sales.length === 0 && (
          <div className="p-10 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
             Vous n'avez pas encore de ventes.
          </div>
        )}
      </div>
    </div>
  );
};

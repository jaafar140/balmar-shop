
import React, { useState } from 'react';
import { Package, Truck, CheckCircle, MapPin, X, Clock, ChevronRight, AlertCircle, Star } from 'lucide-react';
import { TransactionStatus } from '../../types';
import { api } from '../../services/api';

export const Orders: React.FC = () => {
  const [selectedTracking, setSelectedTracking] = useState<any | null>(null);
  const [ratingOrder, setRatingOrder] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  
  const [orders, setOrders] = useState([
    {
      id: 'tx_123',
      product: 'Caftan Vert Mobra',
      price: 1500,
      status: TransactionStatus.SHIPPED,
      sellerId: 'u_seller_1',
      date: '2023-10-25',
      image: 'https://images.unsplash.com/photo-1589810635657-232948472d98?q=80&w=150&auto=format&fit=crop',
      trackingNumber: 'MA-8842-XJ',
      carrier: 'Amana'
    },
    {
      id: 'tx_125',
      product: 'Gandoura Été',
      price: 300,
      status: TransactionStatus.CREATED, 
      sellerId: 'u_seller_2',
      date: 'Aujourd\'hui',
      image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=150',
      trackingNumber: null,
      carrier: null
    }
  ]);

  const handleCancel = async (id: string) => {
      if(window.confirm("Annuler cette commande ?")) {
          await api.transactions.cancel(id);
          setOrders(prev => prev.map(o => o.id === id ? { ...o, status: TransactionStatus.CANCELLED } : o));
      }
  };

  const openRatingModal = (orderId: string) => {
      setRatingOrder(orderId);
      setRatingValue(5);
  };

  const submitRating = async () => {
      if (ratingOrder) {
          const order = orders.find(o => o.id === ratingOrder);
          if (order) {
              await api.transactions.complete(order.id);
              await api.users.rateSeller(order.sellerId, ratingValue);
              setOrders(prev => prev.map(o => o.id === ratingOrder ? { ...o, status: TransactionStatus.COMPLETED } : o));
          }
          setRatingOrder(null);
      }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case TransactionStatus.SHIPPED:
        return <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1"><Truck className="w-3 h-3"/> Expédié</span>;
      case TransactionStatus.DELIVERED:
        return <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1"><Package className="w-3 h-3"/> Livré</span>;
      case TransactionStatus.CANCELLED:
        return <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><X className="w-3 h-3"/> Annulé</span>;
      case TransactionStatus.COMPLETED:
        return <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Terminé</span>;
      case TransactionStatus.CREATED:
        return <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> En attente</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in relative">
      <h1 className="text-2xl font-bold text-gray-900">Mes Commandes</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
             <img src={order.image} alt={order.product} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
             
             <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-gray-900">{order.product}</h3>
                <p className="text-sm text-gray-500">Commande du {order.date}</p>
                <div className="mt-2">{getStatusBadge(order.status)}</div>
                
                {order.trackingNumber && (
                  <p className="text-xs text-gray-400 mt-2 font-mono flex items-center justify-center md:justify-start gap-1">
                    <Truck className="w-3 h-3" />
                    Tracking: {order.trackingNumber}
                  </p>
                )}
             </div>

             <div className="text-right px-4">
                <p className="font-bold text-majorelle text-lg">{order.price} MAD</p>
             </div>

             <div className="flex flex-col gap-2 w-full md:w-auto min-w-[140px]">
                {/* Bouton Suivi */}
                {order.trackingNumber && order.status !== TransactionStatus.COMPLETED && (
                  <button 
                    onClick={() => setSelectedTracking(order)}
                    className="flex-1 px-4 py-2 bg-blue-50 text-majorelle border border-blue-100 rounded-lg text-sm font-bold hover:bg-blue-100 transition flex items-center justify-center gap-2"
                  >
                    Suivre le colis
                  </button>
                )}
                
                {/* Bouton Annuler */}
                {(order.status === TransactionStatus.CREATED || order.status === TransactionStatus.AWAITING_DEPOSIT) && (
                    <button 
                        onClick={() => handleCancel(order.id)}
                        className="flex-1 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition"
                    >
                        Annuler
                    </button>
                )}

                {/* Bouton Valider Réception */}
                {(order.status === TransactionStatus.SHIPPED || order.status === TransactionStatus.DELIVERED) && (
                  <button 
                    onClick={() => openRatingModal(order.id)}
                    className="flex-1 px-4 py-2 bg-majorelle text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition shadow-md"
                  >
                     Valider réception
                  </button>
                )}
             </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
             <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
             <p className="text-gray-500 font-medium">Vous n'avez pas encore de commandes.</p>
          </div>
        )}
      </div>
      
      {/* Tracking Modal */}
      {selectedTracking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedTracking(null)}>
              <div className="bg-white p-6 rounded-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                  <h3 className="font-bold mb-4 flex items-center gap-2"><Truck className="w-5 h-5"/> Simulation de suivi</h3>
                  <div className="space-y-4 border-l-2 border-gray-200 ml-2 pl-4">
                      <div className="relative">
                          <div className="absolute -left-[23px] w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                          <p className="text-sm font-bold text-gray-900">En cours de livraison</p>
                          <p className="text-xs text-gray-500">Casablanca - Aujourd'hui 09:30</p>
                      </div>
                      <div className="relative">
                          <div className="absolute -left-[23px] w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white"></div>
                          <p className="text-sm font-bold text-gray-500">Expédié</p>
                          <p className="text-xs text-gray-500">Tanger - Hier 14:00</p>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Rating Modal */}
      {ratingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Colis bien reçu ?</h3>
                  <p className="text-gray-500 text-sm mb-6">Notez votre expérience pour libérer le paiement au vendeur.</p>
                  
                  <div className="flex justify-center gap-2 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => setRatingValue(star)} className="transition transform hover:scale-110">
                              <Star className={`w-8 h-8 ${star <= ratingValue ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          </button>
                      ))}
                  </div>
                  
                  <textarea 
                      className="w-full p-3 border border-gray-300 rounded-xl text-sm mb-6 focus:ring-2 focus:ring-majorelle outline-none" 
                      rows={3}
                      placeholder="Comment s'est passée la transaction ?"
                      value={ratingComment}
                      onChange={e => setRatingComment(e.target.value)}
                  ></textarea>

                  <button 
                      onClick={submitRating}
                      className="w-full bg-majorelle text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition"
                  >
                      Confirmer & Libérer les fonds
                  </button>
                  <button onClick={() => setRatingOrder(null)} className="w-full mt-2 text-gray-500 text-sm font-bold py-2">Annuler</button>
              </div>
          </div>
      )}
    </div>
  );
};

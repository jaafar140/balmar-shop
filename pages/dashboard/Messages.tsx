
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { messagingService } from '../../services/messagingService';
import { Conversation, Message } from '../../types';
import { Send, ArrowLeft, MoreVertical, ShoppingBag, Loader2, User as UserIcon, Tag, Check, X } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialConvId = searchParams.get('cid');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(initialConvId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showOfferInput, setShowOfferInput] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      messagingService.getUserConversations(user.id).then(data => {
        setConversations(data);
        setLoading(false);
      });
    }
  }, [user, initialConvId]);

  useEffect(() => {
    if (selectedConvId) {
      refreshMessages();
    }
  }, [selectedConvId]);

  const refreshMessages = () => {
      if (selectedConvId) {
          messagingService.getMessages(selectedConvId).then(msgs => {
              setMessages(msgs);
              setTimeout(scrollToBottom, 100);
          });
      }
  };

  useEffect(() => {
      if (initialConvId) setSelectedConvId(initialConvId);
  }, [initialConvId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConvId || !user) return;
    await send(inputText, 'TEXT');
    setInputText('');
  };
  
  const handleSendOffer = async () => {
      if (!offerAmount || !selectedConvId || !user) return;
      await messagingService.sendMessage(selectedConvId, user.id, `Je vous propose une offre de ${offerAmount} MAD`, 'OFFER', parseFloat(offerAmount));
      refreshMessages();
      setShowOfferInput(false);
      setOfferAmount('');
  };

  const handleRespondOffer = async (msgId: string, status: 'ACCEPTED' | 'REJECTED') => {
      await messagingService.respondToOffer(msgId, status);
      refreshMessages();
  };

  const send = async (content: string, type: 'TEXT' | 'OFFER') => {
      if(!selectedConvId || !user) return;
      try {
        const newMsg = await messagingService.sendMessage(selectedConvId, user.id, content, type);
        setMessages(prev => [...prev, newMsg]);
        scrollToBottom();
      } catch (err) { console.error(err); }
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOtherParticipant = (conv: Conversation) => {
    if (!user || !conv.participantDetails) return { name: 'Utilisateur', avatar: '' };
    return conv.participantDetails.find(p => p.id !== user.id) || { name: 'Utilisateur', avatar: '' };
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-majorelle"/></div>;

  const activeConv = conversations.find(c => c.id === selectedConvId);
  const otherUser = activeConv ? getOtherParticipant(activeConv) : null;

  return (
    <div className="h-[calc(100vh-140px)] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex">
      <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${selectedConvId ? 'hidden md:flex' : 'flex'}`}>
         <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-bold text-gray-900">Messages</h2>
         </div>
         <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">Pas de conversations.</div>
            ) : (
              conversations.map(conv => {
                const other = getOtherParticipant(conv);
                const isActive = conv.id === selectedConvId;
                return (
                  <div key={conv.id} onClick={() => { setSelectedConvId(conv.id); navigate(`/messages?cid=${conv.id}`); }} className={`p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition border-b border-gray-50 ${isActive ? 'bg-blue-50/50 border-l-4 border-l-majorelle' : ''}`}>
                    <img src={other.avatar} alt={other.name} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                    <div className="flex-1 min-w-0">
                       <h4 className={`text-sm font-bold truncate ${isActive ? 'text-majorelle' : 'text-gray-900'}`}>{other.name}</h4>
                       <p className="text-xs truncate mt-1 text-gray-500">{conv.lastMessage?.content || 'Nouvelle conversation'}</p>
                    </div>
                  </div>
                );
              })
            )}
         </div>
      </div>

      <div className={`flex-1 flex flex-col bg-sand/30 ${!selectedConvId ? 'hidden md:flex' : 'flex'}`}>
         {selectedConvId && activeConv ? (
           <>
             <div className="p-3 border-b border-gray-200 bg-white flex items-center justify-center md:justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                   <button onClick={() => setSelectedConvId(null)} className="md:hidden p-2 -ml-2 text-gray-500"><ArrowLeft className="w-5 h-5" /></button>
                   <img src={otherUser?.avatar} className="w-10 h-10 rounded-full border border-gray-100" />
                   <div>
                      <h3 className="font-bold text-gray-900 text-sm">{otherUser?.name}</h3>
                      {activeConv.productTitle && <p className="text-xs text-majorelle flex items-center gap-1">Concerne : {activeConv.productTitle}</p>}
                   </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowOfferInput(!showOfferInput)} className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-200 transition flex items-center gap-1">
                        <Tag className="w-3 h-3"/> Faire une offre
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5"/></button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                  const isMe = msg.senderId === user?.id;
                  const isSystem = msg.senderId === 'system';
                  
                  if (isSystem) {
                      return (
                          <div key={msg.id} className="flex justify-center my-2">
                              <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">{msg.content}</span>
                          </div>
                      )
                  }

                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-majorelle text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
                          {msg.type === 'OFFER' ? (
                               <div className="flex flex-col items-center gap-2 min-w-[200px]">
                                   <div className="flex items-center gap-2 opacity-80 border-b border-white/20 pb-1 w-full justify-center">
                                       <Tag className="w-3 h-3"/> <span className="font-bold uppercase text-xs">Proposition de prix</span>
                                   </div>
                                   <span className="font-bold text-2xl my-1">{msg.offerAmount} MAD</span>
                                   
                                   {msg.offerStatus === 'PENDING' && !isMe && (
                                       <div className="flex gap-2 w-full mt-2">
                                           <button onClick={() => handleRespondOffer(msg.id, 'ACCEPTED')} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 rounded text-xs font-bold flex items-center justify-center gap-1"><Check className="w-3 h-3"/> Accepter</button>
                                           <button onClick={() => handleRespondOffer(msg.id, 'REJECTED')} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded text-xs font-bold flex items-center justify-center gap-1"><X className="w-3 h-3"/> Refuser</button>
                                       </div>
                                   )}
                                   {msg.offerStatus === 'ACCEPTED' && <div className="text-xs font-bold bg-green-500/20 text-green-700 px-2 py-1 rounded w-full text-center">Offre Acceptée ✅</div>}
                                   {msg.offerStatus === 'REJECTED' && <div className="text-xs font-bold bg-red-500/20 text-red-700 px-2 py-1 rounded w-full text-center">Offre Refusée ❌</div>}
                                   {msg.offerStatus === 'PENDING' && isMe && <div className="text-xs italic opacity-70">En attente de réponse...</div>}
                               </div>
                          ) : (
                               <p>{msg.content}</p>
                          )}
                          <p className={`text-[9px] text-right mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>{formatTime(msg.createdAt)}</p>
                       </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
             </div>
             
             {showOfferInput && (
                 <div className="p-3 bg-green-50 border-t border-green-100 flex gap-2 items-center animate-in slide-in-from-bottom-2">
                     <span className="text-sm font-bold text-green-800">Votre offre (MAD) :</span>
                     <input type="number" autoFocus className="w-24 p-2 rounded border border-green-200" value={offerAmount} onChange={e => setOfferAmount(e.target.value)} />
                     <button onClick={handleSendOffer} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Envoyer</button>
                     <button onClick={() => setShowOfferInput(false)} className="text-gray-500 ml-auto">Annuler</button>
                 </div>
             )}

             <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Écrivez votre message..." className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-majorelle outline-none" />
                <button type="submit" disabled={!inputText.trim()} className="p-3 bg-majorelle text-white rounded-full hover:bg-blue-800 transition disabled:opacity-50 shadow-md"><Send className="w-5 h-5" /></button>
             </form>
           </>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"><UserIcon className="w-10 h-10 opacity-50" /></div>
              <p>Sélectionnez une conversation pour commencer à négocier.</p>
           </div>
         )}
      </div>
    </div>
  );
};

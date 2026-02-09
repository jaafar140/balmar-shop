
import { Conversation, Message, User, Product } from '../types';
import { api } from './api';

const STORAGE_KEYS = {
  CONVERSATIONS: 'balmar_conversations_v1',
  MESSAGES: 'balmar_messages_v1',
};

// Mock initial conversations
const generateMockConversations = (userId: string): Conversation[] => {
  return [
    {
      id: 'conv_1',
      participants: [userId, 'u_1'],
      productId: 'p_0',
      productTitle: 'Caftan Mobra Vert Royal',
      productImage: 'https://images.unsplash.com/photo-1589810635657-232948472d98?q=80&w=150',
      updatedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      unreadCount: 1,
      lastMessage: {
        id: 'm_1',
        conversationId: 'conv_1',
        senderId: 'u_1',
        content: 'Bonjour, le prix est-il négociable ?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
        isRead: false
      }
    }
  ];
};

export const messagingService = {
  
  getUserConversations: async (userId: string): Promise<Conversation[]> => {
    await new Promise(r => setTimeout(r, 500)); 
    
    let convs: Conversation[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || '[]');
    
    if (convs.length === 0) {
      convs = generateMockConversations(userId);
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs));
    }

    const myConvs = convs.filter(c => c.participants.includes(userId));

    const hydratedConvs = await Promise.all(myConvs.map(async (c) => {
        const otherUserId = c.participants.find(p => p !== userId) || userId;
        return {
            ...c,
            participantDetails: [{
                id: otherUserId,
                name: otherUserId.includes('u_') ? `Utilisateur ${otherUserId}` : 'Karim Vendeur',
                avatar: `https://ui-avatars.com/api/?name=${otherUserId}&background=random`
            }]
        };
    }));

    return hydratedConvs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    await new Promise(r => setTimeout(r, 300));
    const allMessages: Message[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
    
    let msgs = allMessages.filter(m => m.conversationId === conversationId);
    
    if (msgs.length === 0) {
        const convs: Conversation[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || '[]');
        const conv = convs.find(c => c.id === conversationId);
        if (conv && conv.lastMessage) {
            msgs = [conv.lastMessage];
        }
    }
    
    return msgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  sendMessage: async (conversationId: string, senderId: string, content: string, type: 'TEXT' | 'OFFER' = 'TEXT', offerAmount?: number): Promise<Message> => {
    await new Promise(r => setTimeout(r, 300));
    
    const newMessage: Message = {
        id: `m_${Date.now()}`,
        conversationId,
        senderId,
        content,
        type,
        offerAmount,
        offerStatus: type === 'OFFER' ? 'PENDING' : undefined,
        createdAt: new Date(),
        isRead: false
    };

    const allMessages: Message[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
    allMessages.push(newMessage);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages));

    const allConvs: Conversation[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || '[]');
    const convIndex = allConvs.findIndex(c => c.id === conversationId);
    if (convIndex >= 0) {
        allConvs[convIndex].lastMessage = newMessage;
        allConvs[convIndex].updatedAt = new Date();
        allConvs[convIndex].unreadCount += 1;
        localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(allConvs));
    }

    return newMessage;
  },

  // Répondre à une offre (Accepter/Refuser)
  respondToOffer: async (messageId: string, status: 'ACCEPTED' | 'REJECTED'): Promise<void> => {
      await new Promise(r => setTimeout(r, 300));
      const allMessages: Message[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
      const index = allMessages.findIndex(m => m.id === messageId);
      
      if (index !== -1) {
          allMessages[index].offerStatus = status;
          
          // Ajouter un message système de confirmation
          const systemMsg: Message = {
              id: `m_sys_${Date.now()}`,
              conversationId: allMessages[index].conversationId,
              senderId: 'system',
              content: status === 'ACCEPTED' ? 'Offre acceptée ! Vous pouvez procéder au paiement.' : 'Offre refusée.',
              createdAt: new Date(),
              isRead: false
          };
          allMessages.push(systemMsg);
          
          localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages));
      }
  },

  startConversation: async (buyerId: string, sellerId: string, product: Product): Promise<string> => {
    const allConvs: Conversation[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || '[]');
    
    const existing = allConvs.find(c => 
        c.participants.includes(buyerId) && 
        c.participants.includes(sellerId) && 
        c.productId === product.id
    );

    if (existing) return existing.id;

    const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        participants: [buyerId, sellerId],
        productId: product.id,
        productTitle: product.title,
        productImage: product.images[0],
        updatedAt: new Date(),
        unreadCount: 0
    };

    allConvs.push(newConv);
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(allConvs));
    return newConv.id;
  }
};

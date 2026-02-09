
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Notification } from '../../types';
import { Bell, Info, Package, Tag, Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        api.users.getNotifications().then(setNotifications);
    }, []);
    
    const handleRead = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        await api.users.markNotificationRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const handleClick = async (notif: Notification) => {
        if (!notif.isRead) {
            await api.users.markNotificationRead(notif.id);
        }
        if (notif.link) {
            navigate(notif.link);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'ORDER': return <Package className="w-5 h-5"/>;
            case 'PROMO': return <Tag className="w-5 h-5"/>;
            case 'NEW_POST': return <Sparkles className="w-5 h-5"/>;
            default: return <Info className="w-5 h-5"/>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            
            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <div 
                            key={notif.id} 
                            onClick={() => handleClick(notif)}
                            className={`p-4 rounded-xl border flex gap-4 cursor-pointer transition ${notif.isRead ? 'bg-white border-gray-200 hover:bg-gray-50' : 'bg-blue-50 border-blue-100 hover:bg-blue-100/50'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.isRead ? 'bg-gray-100 text-gray-500' : 'bg-white text-majorelle shadow-sm'}`}>
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-sm ${notif.isRead ? 'font-medium text-gray-900' : 'font-bold text-majorelle'}`}>{notif.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                <p className="text-xs text-gray-400 mt-2">{new Date(notif.date).toLocaleDateString()} • {new Date(notif.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                            {!notif.isRead && (
                                <button onClick={(e) => handleRead(e, notif.id)} className="p-2 text-majorelle hover:bg-blue-200 rounded-lg h-fit" title="Marquer comme lu">
                                    <Check className="w-4 h-4"/>
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4"/>
                        <p className="text-gray-500">Aucune notification pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
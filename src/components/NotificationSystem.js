import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
const NotificationSystem = ({ className = '' }) => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    // Simular notificações em tempo real
    useEffect(() => {
        const generateNotifications = () => {
            const notificationTypes = [
                {
                    type: 'success',
                    title: 'Dados Sincronizados',
                    message: 'Todas as alterações foram salvas no Supabase com sucesso'
                },
                {
                    type: 'info',
                    title: 'Sistema Atualizado',
                    message: 'Nova versão do admin panel disponível com melhorias'
                },
                {
                    type: 'warning',
                    title: 'Backup Recomendado',
                    message: 'Faça backup dos seus dados regularmente para segurança'
                },
                {
                    type: 'success',
                    title: 'CRUD Funcionando',
                    message: 'Sistema de CRUD agora grava em tempo real no banco de dados'
                },
                {
                    type: 'info',
                    title: 'Responsividade Ativa',
                    message: 'Dashboard agora é 100% responsivo em todos os dispositivos'
                }
            ];
            const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
            const newNotification = {
                id: Date.now().toString(),
                ...randomNotification,
                timestamp: new Date(),
                read: false
            };
            setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Manter apenas 10 notificações
        };
        // Gerar notificação inicial
        generateNotifications();
        // Gerar notificações aleatórias
        const interval = setInterval(() => {
            if (Math.random() > 0.8) { // 20% de chance a cada 45 segundos
                generateNotifications();
            }
        }, 45000);
        return () => clearInterval(interval);
    }, []);
    // Atualizar contador de não lidas
    useEffect(() => {
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);
    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };
    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return _jsx(CheckCircle, { className: "w-5 h-5 text-green-400" });
            case 'error':
                return _jsx(XCircle, { className: "w-5 h-5 text-red-400" });
            case 'warning':
                return _jsx(AlertTriangle, { className: "w-5 h-5 text-yellow-400" });
            case 'info':
                return _jsx(Info, { className: "w-5 h-5 text-blue-400" });
        }
    };
    const getColorClasses = (type) => {
        switch (type) {
            case 'success':
                return 'border-green-500/30 bg-green-500/10';
            case 'error':
                return 'border-red-500/30 bg-red-500/10';
            case 'warning':
                return 'border-yellow-500/30 bg-yellow-500/10';
            case 'info':
                return 'border-blue-500/30 bg-blue-500/10';
        }
    };
    return (_jsxs("div", { className: `relative ${className}`, children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "relative p-2 rounded-lg bg-gray-800/50 border border-gray-600 hover:border-cyan-400 transition-all duration-300", children: [_jsx(Bell, { className: "w-5 h-5 text-gray-400 hover:text-cyan-400 transition-colors" }), unreadCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse", children: unreadCount > 9 ? '9+' : unreadCount }))] }), isOpen && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-40", onClick: () => setIsOpen(false) }), _jsxs("div", { className: "absolute right-0 top-12 w-80 sm:w-96 bg-gray-900/95 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-700", children: [_jsxs("h3", { className: "text-lg font-semibold text-cyan-400 flex items-center", children: [_jsx(Bell, { className: "w-5 h-5 mr-2" }), "Notifica\u00E7\u00F5es"] }), _jsxs("div", { className: "flex items-center space-x-2", children: [unreadCount > 0 && (_jsx("button", { onClick: markAllAsRead, className: "text-xs text-gray-400 hover:text-cyan-400 transition-colors px-2 py-1 rounded bg-gray-800/50", children: "Marcar todas como lidas" })), _jsx("button", { onClick: () => setIsOpen(false), className: "p-1 rounded hover:bg-gray-800 transition-colors", children: _jsx(X, { className: "w-4 h-4 text-gray-400" }) })] })] }), _jsx("div", { className: "max-h-80 overflow-y-auto", children: notifications.length === 0 ? (_jsxs("div", { className: "p-6 text-center text-gray-400", children: [_jsx(Bell, { className: "w-8 h-8 mx-auto mb-2 opacity-50" }), _jsx("p", { children: "Nenhuma notifica\u00E7\u00E3o" })] })) : (_jsx("div", { className: "space-y-1", children: notifications.map((notification) => (_jsx("div", { className: `p-4 border-l-4 ${getColorClasses(notification.type)} ${!notification.read ? 'bg-gray-800/30' : 'bg-gray-800/10'} hover:bg-gray-800/50 transition-colors cursor-pointer`, onClick: () => markAsRead(notification.id), children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "flex-shrink-0 mt-0.5", children: getIcon(notification.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: `text-sm font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`, children: notification.title }), _jsx("button", { onClick: (e) => {
                                                                        e.stopPropagation();
                                                                        removeNotification(notification.id);
                                                                    }, className: "p-1 rounded hover:bg-gray-700 transition-colors", children: _jsx(X, { className: "w-3 h-3 text-gray-400" }) })] }), _jsx("p", { className: "text-sm text-gray-400 mt-1 leading-relaxed", children: notification.message }), _jsxs("div", { className: "flex items-center justify-between mt-2", children: [_jsx("span", { className: "text-xs text-gray-500", children: notification.timestamp.toLocaleTimeString('pt-BR', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    }) }), !notification.read && (_jsx("div", { className: "w-2 h-2 bg-cyan-400 rounded-full animate-pulse" }))] }), notification.action && (_jsx("button", { onClick: (e) => {
                                                                e.stopPropagation();
                                                                notification.action.onClick();
                                                            }, className: "mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors", children: notification.action.label }))] })] }) }, notification.id))) })) }), _jsx("div", { className: "p-3 border-t border-gray-700 bg-gray-800/30", children: _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-400", children: [_jsxs("span", { children: ["Total: ", notifications.length] }), _jsxs("span", { children: ["N\u00E3o lidas: ", unreadCount] })] }) })] })] }))] }));
};
export default NotificationSystem;

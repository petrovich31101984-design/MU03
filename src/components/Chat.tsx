import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { formatDateTime } from '../utils/dateFormat';

export default function Chat() {
  const employees = useStore(s => s.employees);
  const messages = useStore(s => s.messages);
  const addMessage = useStore(s => s.addMessage);
  const markMessageRead = useStore(s => s.markMessageRead);

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);

  const dialogPartners = [...new Set(
    messages
      .filter(m => m.fromId === 'admin' || m.toId === 'admin')
      .map(m => m.fromId === 'admin' ? m.toId : m.fromId)
  )];

  const allPossiblePartners = ['storekeeper', ...employees.map(e => e.id)];

  const filteredPartners = dialogPartners.filter(partnerId => {
    const emp = employees.find(e => e.id === partnerId);
    if (!emp) return partnerId === 'storekeeper';
    return emp.fullName.toLowerCase().includes(search.toLowerCase());
  });

  const availableNewPartners = allPossiblePartners.filter(partnerId => {
    if (dialogPartners.includes(partnerId)) return false;
    const emp = employees.find(e => e.id === partnerId);
    if (!emp) return partnerId === 'storekeeper';
    return emp.fullName.toLowerCase().includes(search.toLowerCase());
  });

  const getChatMessages = (partnerId: string) => {
    return messages
      .filter(m =>
        (m.fromId === 'admin' && m.toId === partnerId) ||
        (m.fromId === partnerId && m.toId === 'admin')
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const getUnreadCount = (partnerId: string) => {
    return messages.filter(m => m.fromId === partnerId && m.toId === 'admin' && !m.read).length;
  };

  const getPartnerName = (partnerId: string) => {
    if (partnerId === 'storekeeper') return '📦 Кладовщик';
    const emp = employees.find(e => e.id === partnerId);
    return emp?.fullName || partnerId;
  };

  useEffect(() => {
    if (selectedChat) {
      const unreadMessages = messages.filter(
        m => m.fromId === selectedChat && m.toId === 'admin' && !m.read
      );
      unreadMessages.forEach(msg => {
        markMessageRead(msg.id);
      });
    }
  }, [selectedChat, messages, markMessageRead]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedChat) return;
    addMessage({
      fromId: 'admin',
      toId: selectedChat,
      text: newMessage.trim(),
      read: false,
    });
    setNewMessage('');
  };

  const handleSelectNewChat = (partnerId: string) => {
    setSelectedChat(partnerId);
    setShowNewChat(false);
    setSearch('');
  };

  const selectedMessages = selectedChat ? getChatMessages(selectedChat) : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-12rem)]">
      <div className="flex h-full">
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200 space-y-2">
            <input
              type="text"
              placeholder="Поиск..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setShowNewChat(!showNewChat)}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              ➕ Новый чат
            </button>
          </div>

          {showNewChat && (
            <div className="border-b border-gray-200 bg-blue-50 max-h-48 overflow-auto">
              <div className="p-2 text-xs font-medium text-gray-600">Выберите собеседника:</div>
              {availableNewPartners.length === 0 ? (
                <div className="p-3 text-sm text-gray-500 text-center">Нет доступных собеседников</div>
              ) : (
                availableNewPartners.map(partnerId => (
                  <button
                    key={partnerId}
                    onClick={() => handleSelectNewChat(partnerId)}
                    className="w-full p-2 text-left hover:bg-white transition flex items-center gap-2"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                      {partnerId === 'storekeeper' ? '📦' : '👨‍⚕️'}
                    </div>
                    <span className="text-sm text-gray-800">{getPartnerName(partnerId)}</span>
                  </button>
                ))
              )}
            </div>
          )}

          <div className="flex-1 overflow-auto">
            {filteredPartners.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <div className="text-3xl mb-2">📭</div>
                <p className="text-sm">Нет диалогов</p>
                <p className="text-xs mt-1">Нажмите "Новый чат" чтобы начать</p>
              </div>
            ) : (
              filteredPartners.map(partnerId => {
                const chatMsgs = getChatMessages(partnerId);
                const lastMsg = chatMsgs[chatMsgs.length - 1];
                const unread = getUnreadCount(partnerId);
                return (
                  <button
                    key={partnerId}
                    onClick={() => setSelectedChat(partnerId)}
                    className={`w-full p-3 text-left border-b border-gray-100 hover:bg-gray-50 transition ${
                      selectedChat === partnerId ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                        {partnerId === 'storekeeper' ? '📦' : '👨‍⚕️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm text-gray-800 truncate">
                            {getPartnerName(partnerId)}
                          </span>
                          {unread > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {unread}
                            </span>
                          )}
                        </div>
                        {lastMsg && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {lastMsg.fromId === 'admin' ? 'Вы: ' : ''}{lastMsg.text}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-800">{getPartnerName(selectedChat)}</h3>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50">
                {selectedMessages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">💬</div>
                      <p className="text-sm">Начните диалог</p>
                    </div>
                  </div>
                ) : (
                  selectedMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.fromId === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-xl px-4 py-2 ${
                          msg.fromId === 'admin'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.fromId === 'admin' ? 'text-blue-200' : 'text-gray-400'}`}>
                          {formatDateTime(msg.date)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Введите сообщение..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Отправить
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">💬</div>
                <p>Выберите диалог или создайте новый</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

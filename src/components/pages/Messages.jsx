import { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Messages = () => {
  const [selectedChannel, setSelectedChannel] = useState(1);
  const [message, setMessage] = useState("");
  
  const channels = [
    { id: 1, name: "Website Redesign", type: "project", unread: 3 },
    { id: 2, name: "Mobile App Development", type: "project", unread: 0 },
    { id: 3, name: "Marketing Team", type: "group", unread: 5 },
    { id: 4, name: "Design Team", type: "group", unread: 1 },
  ];
  
  const messages = [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      message: "Hey team! Just uploaded the latest design mockups to the project files.",
      time: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      user: "You",
      avatar: null,
      message: "Great work! I'll review them this afternoon.",
      time: "10:32 AM",
      isOwn: true
    },
    {
      id: 3,
      user: "David Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      message: "The responsive navigation task is complete. Moving it to Review.",
      time: "11:15 AM",
      isOwn: false
    },
  ];
  
  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <p className="text-slate-600 mt-1">Communicate with your team</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-250px)]">
        <Card className="lg:col-span-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Channels</h2>
            <Button size="sm" icon="Plus" className="w-full">
              New Channel
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                className={cn(
                  "w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors",
                  selectedChannel === channel.id && "bg-primary-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <ApperIcon
                    name={channel.type === "project" ? "Hash" : "Users"}
                    size={16}
                    className={cn(
                      selectedChannel === channel.id ? "text-primary-600" : "text-slate-400"
                    )}
                  />
                  <span className={cn(
                    "text-sm font-medium",
                    selectedChannel === channel.id ? "text-primary-700" : "text-slate-700"
                  )}>
                    {channel.name}
                  </span>
                </div>
                {channel.unread > 0 && (
                  <span className="w-5 h-5 bg-primary-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                    {channel.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>
        
        <Card className="lg:col-span-3 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ApperIcon name="Hash" size={20} className="text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-900">
                  {channels.find(c => c.id === selectedChannel)?.name}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" icon="Phone" />
                <Button variant="ghost" size="sm" icon="Video" />
                <Button variant="ghost" size="sm" icon="MoreVertical" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.isOwn && "flex-row-reverse"
                )}
              >
                <Avatar
                  src={msg.avatar}
                  name={msg.user}
                  size="md"
                />
                <div className={cn(
                  "flex-1 max-w-lg",
                  msg.isOwn && "items-end"
                )}>
                  <div className={cn(
                    "flex items-center gap-2 mb-1",
                    msg.isOwn && "flex-row-reverse"
                  )}>
                    <span className="text-sm font-medium text-slate-900">
                      {msg.user}
                    </span>
                    <span className="text-xs text-slate-500">{msg.time}</span>
                  </div>
                  <div className={cn(
                    "px-4 py-2 rounded-lg",
                    msg.isOwn
                      ? "bg-primary-600 text-white"
                      : "bg-slate-100 text-slate-900"
                  )}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" icon="Paperclip" />
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                icon="Send"
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
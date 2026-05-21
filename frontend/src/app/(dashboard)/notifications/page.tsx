"use client";

import { Bell, CheckCheck, LucideIcon, Shield, Wrench } from "lucide-react";

const NOTIFICATIONS = [
  { _id: "1", type: "warranty", title: "Warranty Expiring Soon", message: "iPhone 15 Pro warranty expires in 25 days", time: "2 hours ago", read: false, severity: "Warning" },
  { _id: "2", type: "repair", title: "Repair Update", message: "Screen repair for iPhone 15 Pro is in progress", time: "1 day ago", read: false, severity: "Info" },
  { _id: "3", type: "warranty", title: "Warranty Expired", message: "LG 1.5 Ton AC warranty has expired", time: "3 days ago", read: true, severity: "Error" },
  { _id: "4", type: "system", title: "Product Added", message: "Dell XPS 15 was successfully added to your vault", time: "5 days ago", read: true, severity: "Info" },
];

const ICONS: Record<string, LucideIcon> = {
  repair: Wrench,
  system: Bell,
  warranty: Shield,
};

const COLORS: Record<string, string> = {
  Error: "#C53030",
  Info: "#067D62",
  Warning: "#B7791F",
};

export default function NotificationsPage() {
  const unread = NOTIFICATIONS.filter((notification) => !notification.read).length;

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="page-kicker">{unread} unread operational alerts</p>
        </div>
        <button className="btn-secondary" type="button">
          <CheckCheck size={16} />
          Mark all as read
        </button>
      </div>

      <div className="card p-0">
        <div className="section-title"><h4>Alerts Feed</h4></div>
        <div className="divide-y divide-[#E5E7EB]">
          {NOTIFICATIONS.map((notification) => {
            const Icon = ICONS[notification.type] || Bell;
            return (
              <div className={`grid gap-4 px-4 py-4 md:grid-cols-[40px_1fr_120px_90px] ${notification.read ? "bg-white" : "bg-[#FFF7E6]"}`} key={notification._id}>
                <span className="icon-box">
                  <Icon size={17} style={{ color: COLORS[notification.severity] }} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{notification.title}</p>
                    {!notification.read && <span className="h-2 w-2 rounded-full bg-[#FF9900]" />}
                  </div>
                  <p className="mt-1 text-[#6B7280]">{notification.message}</p>
                </div>
                <span className="text-sm text-[#6B7280]">{notification.time}</span>
                <span className="status-badge badge-neutral justify-center">{notification.severity}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

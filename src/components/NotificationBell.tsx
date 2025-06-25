"use client";

import React, { useState } from "react";
import { Bell, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  description?: string;
  severity: "urgent" | "medium" | "low";
  timestamp: string;
  isRead?: boolean;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Bamboo 1: Root Rot Detected",
      severity: "urgent",
      timestamp: "2 min ago",
      isRead: false,
    },
    {
      id: "2",
      title: "Bamboo 2: Powdery Mildew Detected",
      severity: "medium",
      timestamp: "15 min ago",
      isRead: false,
    },
    {
      id: "3",
      title: "Bamboo 3: Overwatering Detected",
      severity: "low",
      timestamp: "1 hour ago",
      isRead: false,
    },
    {
      id: "4",
      title: "Unauthorized Access Detected in Garden Area",
      severity: "urgent",
      timestamp: "2 hours ago",
      isRead: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getSeverityConfig = (severity: Notification["severity"]) => {
    switch (severity) {
      case "urgent":
        return {
          badgeClass: "bg-red-100 text-red-800 border-red-200",
          label: "Urgent",
        };
      case "medium":
        return {
          badgeClass: "bg-orange-100 text-orange-800 border-orange-200",
          label: "Medium",
        };
      case "low":
        return {
          badgeClass: "bg-green-100 text-green-800 border-green-200",
          label: "Low",
        };
      default:
        return {
          badgeClass: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Info",
        };
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-10 w-10 scale-[125%]" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-96 max-h-96 overflow-y-auto"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification, index) => {
              const severityConfig = getSeverityConfig(notification.severity);

              return (
                <React.Fragment key={notification.id}>
                  <DropdownMenuItem
                    className={`p-0 focus:bg-gray-50 ${!notification.isRead ? "bg-blue-50/30" : ""}`}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <div className="w-full p-4 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className={`text-sm font-medium truncate ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}
                            >
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className={`text-xs font-medium ${severityConfig.badgeClass}`}
                            >
                              {severityConfig.label}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {notification.timestamp}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-8 w-8 p-0 flex-shrink-0 text-gray-400 hover:text-gray-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuItem>

                  {index < notifications.length - 1 && (
                    <DropdownMenuSeparator />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;

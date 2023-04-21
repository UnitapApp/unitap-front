import React, { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { Notification } from "../types";
import { Slide, toast } from "react-toastify";

import uuid from "react-uuid";

const NotificationsContext = React.createContext<{
  notifications: Notification[],
  addNotification: (notification: Notification) => void,
}>({
  notifications: [],
  addNotification: (notification: Notification) => {
  }
});

const NotificationsProvider = ({ children }: PropsWithChildren<{}>) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showedNotifications, setShowedNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Notification) => {
    notification.id = uuid();
    setNotifications(
      (notifications: Notification[]) => [...notifications, notification]
    );
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      let notification = notifications[notifications.length - 1];

      if (!showedNotifications.find(n => n.id === notification.id)) {
        toast(notifications[notifications.length - 1].message, {
          type: notifications[notifications.length - 1].type,
          hideProgressBar: true,
          position: "bottom-right",
          transition: Slide,
          theme: "dark",
          closeOnClick: false,
          pauseOnHover: false,
          autoClose: 5000000
        });
        setShowedNotifications([...showedNotifications, notification]);
      }
    }
  }, [notifications, showedNotifications]);

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification }}>{children}</NotificationsContext.Provider>
  );
};

export { NotificationsContext, NotificationsProvider };
import React, { PropsWithChildren, useEffect, useState } from "react";
import {Notification} from "../types";
import { Slide, toast } from "react-toastify";

const NotificationsContext = React.createContext<{
  notifications: Notification[],
  addNotification: (notification: Notification) => void,
}>({
  notifications: [],
  addNotification: (notification: Notification) => {},
});

const NotificationsProvider = ({children}: PropsWithChildren<{}>) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    setNotifications([...notifications, notification]);
  }

  useEffect(() => {
    if (notifications.length > 0) {
      toast(notifications[notifications.length - 1].message, {
        type: notifications[notifications.length - 1].type,
        autoClose: 5000,
        hideProgressBar: true,
        position: "bottom-right",
        transition: Slide,
        theme: "dark"
      })
    }
  }, [notifications]);

  return (
    <NotificationsContext.Provider value={{notifications, addNotification}}>{children}</NotificationsContext.Provider>
  );
};

export {NotificationsContext, NotificationsProvider};
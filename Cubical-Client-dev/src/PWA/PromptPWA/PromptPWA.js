import { useState, useEffect } from "react";

// Hooks
import { useMobile } from "../../hooks/useMobile";

// Design component
import { Banner } from "../../stories/Banner/Banner";

export const PromptPWA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState(null);

  const { isMobile } = useMobile();

  useEffect(() => {
    if (window.pwaEvent && getCookieByName("app-install-banner") !== "dismissed" && !isMobile) {
      setIsOpen(true);
      setInstallPromptEvent(window.pwaEvent);
      window.pwaEvent = null;
    }
  }, [window.pwaEvent]);

  const getCookieByName = name => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const handleInstallAccepted = () => {
    installPromptEvent.prompt();
    setIsOpen(false);
    installPromptEvent.userChoice.then(choice => {
      if (choice.outcome === "accepted") {
        setInstallPromptEvent(null);
      }
    });
  };

  const handleClose = () => {
    document.cookie = "app-install-banner=dismissed";
    setIsOpen(false);
    setInstallPromptEvent(null);
  };

  return (
    <Banner
      open={isOpen}
      onClose={handleClose}
      onOK={handleInstallAccepted}
      {...{
        title: "האם להתקין את האפלקציה?",
        massage: "זה יעזור לך לפתוח את המערכת בקלות בפעם הבאה",
        labelButton: "להתקין",
        PropsButton: {
          size: "x-small",
          outline: true,
          backgroundColor: "rgba(0,0,0,0)"
        }
      }}
    />
  );
};

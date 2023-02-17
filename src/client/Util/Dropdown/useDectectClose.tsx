import { useEffect, useState, useRef } from "react";

const useDetectClose = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const removeHandler = () => {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const onClick = (e) => {
      setIsOpen(!isOpen)
    };
    
    if (isOpen) {
      window.addEventListener("click", onClick);
    }

    return () => {
      window.removeEventListener("click", onClick);
    };
  }, [isOpen]);

  return [isOpen, removeHandler];
};

export default useDetectClose;
 
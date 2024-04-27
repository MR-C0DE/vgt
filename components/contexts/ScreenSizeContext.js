import React, { createContext, useState, useEffect, useContext } from 'react';

const ScreenSizeContext = createContext();

export const ScreenSizeProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Check if window is defined (browser environment)
    if (typeof window !== 'undefined') {
      // Initial call to set the size
      handleResize();
      
      // Event listener for window resize
      window.addEventListener('resize', handleResize);

      // Cleanup the event listener
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <ScreenSizeContext.Provider value={screenSize}>
      {children}
    </ScreenSizeContext.Provider>
  );
};

export const useScreenSize = () => useContext(ScreenSizeContext);

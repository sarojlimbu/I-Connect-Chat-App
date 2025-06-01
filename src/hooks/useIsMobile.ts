import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export function useIsMobile(breakpoint = 768) {
  const [isClient, setIsClient] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: breakpoint });

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? isMobile : false;
}

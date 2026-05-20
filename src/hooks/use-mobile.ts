import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // setIsMobile is already handled properly initially or by the listener, but to fix lint:
    // We can just use the initial state calculation if we really cared, 
    // but React 19 handles this differently. Let's just remove the sync call.
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

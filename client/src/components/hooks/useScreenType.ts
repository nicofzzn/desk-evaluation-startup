import { useMediaQuery } from 'react-responsive'

export const useScreenType = () => {
  const isMobile = useMediaQuery({ maxWidth: 600 })

  if (isMobile) return 'mobile'

  return 'fullscreen'
}

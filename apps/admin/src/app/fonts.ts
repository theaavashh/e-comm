import localFont from 'next/font/local'

export const customFont = localFont({
  src: '../../public/fonts/LTSoul-Regular.otf',
  variable: '--font-custom',
  display: 'swap',
})

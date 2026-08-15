'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NewsletterPopup from '@/components/NewsletterPopup'
import CartDrawer from '@/components/CartDrawer'

const OPAQUE_PATHS = ['/prodotti', '/storia', '/privacy', '/resi', '/contatti', '/checkout', '/ordini']

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)
  const pathname = usePathname()
  const forceOpaque = OPAQUE_PATHS.some(p => pathname.includes(p))

  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} forceOpaque={forceOpaque} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      {children}
      <Footer />
      <NewsletterPopup />
    </>
  )
}

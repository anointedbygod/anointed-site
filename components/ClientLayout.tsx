'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NewsletterPopup from '@/components/NewsletterPopup'
import CartDrawer from '@/components/CartDrawer'
import { useCarrello } from '@/lib/carrello'

const OPAQUE_PATHS = ['/prodotti', '/storia', '/privacy', '/resi', '/contatti', '/checkout', '/ordini', '/account']

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { drawerOpen, apriDrawer, chiudiDrawer } = useCarrello()
  const pathname = usePathname()
  const forceOpaque = OPAQUE_PATHS.some(p => pathname.includes(p))
  return (
    <>
      <Navbar onCartClick={apriDrawer} forceOpaque={forceOpaque} />
      <CartDrawer open={drawerOpen} onClose={chiudiDrawer} />
      {children}
      <Footer />
      <NewsletterPopup />
    </>
  )
}

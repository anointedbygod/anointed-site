'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function WishlistButton({ prodottoId, size = 20 }: { prodottoId: string; size?: number }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [inWishlist, setInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null)
      if (data.user?.id) {
        fetch(`/api/wishlist?user_id=${data.user.id}`)
          .then(r => r.json())
          .then(list => {
            if (Array.isArray(list)) setInWishlist(list.some((w: any) => w.prodotto_id === prodottoId))
          })
      }
    })
  }, [prodottoId])

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!userId) {
      alert('Accedi al tuo account per salvare i preferiti.')
      return
    }
    setLoading(true)
    if (inWishlist) {
      await fetch(`/api/wishlist?user_id=${userId}&prodotto_id=${prodottoId}`, { method: 'DELETE' })
      setInWishlist(false)
    } else {
      await fetch('/api/wishlist', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, prodotto_id: prodottoId }),
      })
      setInWishlist(true)
    }
    setLoading(false)
  }

  return (
    <button onClick={toggle} disabled={loading} style={{
      background: 'rgba(241,234,228,0.9)', backdropFilter: 'blur(4px)',
      border: 'none', borderRadius: '50%', width: `${size + 16}px`, height: `${size + 16}px`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', transition: 'transform 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill={inWishlist ? '#3a2e2b' : 'none'} stroke="#3a2e2b" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  )
}

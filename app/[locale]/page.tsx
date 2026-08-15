import Hero from '@/components/Hero'
import Categories from '@/components/Categories'
import BrandStory from '@/components/BrandStory'
import BestSellers from '@/components/BestSellers'
import EditorialBanner from '@/components/EditorialBanner'
import Testimonials from '@/components/Testimonials'

export default function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <BrandStory />
      <BestSellers />
      <EditorialBanner />
      <Testimonials />
    </main>
  )
}

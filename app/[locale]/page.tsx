import Hero from '@/components/Hero'
import Categories from '@/components/Categories'
import BrandStory from '@/components/BrandStory'
import BestSellers from '@/components/BestSellers'
import EditorialBanner from '@/components/EditorialBanner'
import InstagramShowcase from '@/components/InstagramShowcase'
import AnointedWorldPreview from '@/components/AnointedWorldPreview'

export default function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <BrandStory />
      <BestSellers />
      <EditorialBanner />
      <InstagramShowcase />
      <AnointedWorldPreview />
    </main>
  )
}

import ProductCard from '../components/ProductCard'

const products = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    price: 249990,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=250&fit=crop',
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    price: 119990,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=250&fit=crop',
  },
  {
    id: 3,
    name: 'AirPods Pro',
    price: 24990,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=250&fit=crop',
  },
  {
    id: 4,
    name: 'Apple Watch Ultra',
    price: 89990,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=250&fit=crop',
  },
  {
    id: 5,
    name: 'iPad Pro M4',
    price: 139990,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=250&fit=crop',
  },
]

function Catalog() {
  return (
    <div>
      <h1 className="page-title">Каталог товаров</h1>
      <div className="catalog">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Catalog
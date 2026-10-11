import { useEffect, useState, useMemo } from 'react'
import { getServices } from '../api/api'
import ProductCard from '../components/ProductCard'

export default function Catalog() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('all')
  const [maxPrice, setMaxPrice] = useState('')
  const [search, setSearch] = useState('')

  // Загрузка услуг с сервера при монтировании
  useEffect(() => {
    getServices()
      .then(setServices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Собираем уникальные категории из услуг
  const categories = useMemo(() => {
    const set = new Set(services.map((s) => s.category).filter(Boolean))
    return ['all', ...set]
  }, [services])

  // Фильтрация услуг по категории, цене и поиску
  const filtered = useMemo(() => {
    return services.filter((s) => {
      if (category !== 'all' && s.category !== category) return false
      if (maxPrice && Number(s.price) > Number(maxPrice)) return false
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [services, category, maxPrice, search])

  if (loading) return <p className="status">Загрузка услуг...</p>
  if (error) return <p className="error">Ошибка: {error}</p>

  return (
    <div className="catalog-page">
      <h1 className="page-title">Каталог услуг</h1>

      <div className="filters">
        <input
          className="form__input"
          type="text"
          placeholder="Поиск по названию"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form__input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'all' ? 'Все категории' : c}
            </option>
          ))}
        </select>

        <input
          className="form__input"
          type="number"
          placeholder="Макс. цена"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="status">Ничего не найдено</p>
      ) : (
        <div className="catalog">
          {filtered.map((service) => (
            <ProductCard key={service.id} product={service} />
          ))}
        </div>
      )}
    </div>
  )
}
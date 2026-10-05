import { useState, useEffect, use } from "react";
import { getService } from "../api/api";
import ProductCart from "../components/ProductCard"
import { data } from "react-router-dom";

function Catalog() {
  const [service, setService] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getService()
      .then(data => setService(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="status">Загрузка товаров</p>
  if (error) return <p className="error">Ошибка {error}</p>
  if (service.length === 0) return <p>Товаров пока нет, возвращайтесь позже</p>

  return (
    <div>
      <h1 className="page-title">Каталог товаров</h1>
      <div className="catalog">
        {service.map(service => (
          <ProductCart key={service.id} product={service}/>
        ))}
      </div>
    </div>
  )
}

export default Catalog
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getServiceById, createReview } from '../api/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function ServiceDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewMsg, setReviewMsg] = useState('')

  // Загрузка услуги с отзывами
  function load() {
    setLoading(true)
    getServiceById(id)
      .then(setService)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  // Добавление услуги в корзину
  async function handleAdd() {
    if (!user) return navigate('/login')
    try {
      await addToCart(service)
      navigate('/cart')
    } catch (err) {
      alert(err.message)
    }
  }

  // Отправка отзыва
  async function handleReview(e) {
    e.preventDefault()
    setReviewMsg('')
    if (!user) return
    try {
      await createReview(user.id, service.id, rating, comment)
      setComment('')
      setReviewMsg('Отзыв добавлен')
      load()
    } catch (err) {
      setReviewMsg(err.message)
    }
  }

  if (loading) return <p className="status">Загрузка...</p>
  if (error) return <p className="form__error">{error}</p>
  if (!service) return null

  return (
    <div className="service-detail">
      <button className="btn btn--small" onClick={() => navigate(-1)}>← Назад</button>

      <div className="service-detail__main">
        {service.image && <img src={service.image} alt={service.name} />}
        <div>
          <h1>{service.name}</h1>
          <span className="card__category">{service.category}</span>
          <p>{service.description}</p>
          <p>Длительность: {service.duration} мин</p>
          <p className="card__price">
            {Number(service.price).toLocaleString('ru-RU')} ₽
          </p>
          <button className="btn btn--add" onClick={handleAdd}>В корзину</button>
        </div>
      </div>

      <section className="reviews">
        <h2>Отзывы</h2>

        {service.reviews.length === 0 && <p className="status">Пока нет отзывов</p>}

        {service.reviews.map((r) => (
          <div key={r.id} className="review">
            <div className="review__head">
              <b>{r.user_name}</b>
              <span className="review__stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
            </div>
            {r.comment && <p>{r.comment}</p>}
            <small>{new Date(r.created_at).toLocaleDateString('ru-RU')}</small>
          </div>
        ))}

        {user ? (
          <form className="login__form" onSubmit={handleReview}>
            <h3>Оставить отзыв</h3>
            <div className="form__group">
              <label className="form__label">Оценка</label>
              <select
                className="form__input"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} ★</option>
                ))}
              </select>
            </div>
            <div className="form__group">
              <label className="form__label">Комментарий</label>
              <textarea
                className="form__input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
            {reviewMsg && <p className="form__hint">{reviewMsg}</p>}
            <button className="btn btn--add" type="submit">Отправить</button>
          </form>
        ) : (
          <p className="status">Войдите, чтобы оставить отзыв</p>
        )}
      </section>
    </div>
  )
}
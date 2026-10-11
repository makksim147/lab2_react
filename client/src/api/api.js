const BASE_URL = 'http://localhost:5000/api'

// Универсальная обёртка над fetch — единая обработка ошибок
async function request(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Ошибка запроса')
  return data
}

// Получить список всех услуг с категориями
export const getServices = () => request('/services')

// Получить одну услугу с её отзывами
export const getServiceById = (id) => request(`/services/${id}`)

// Авторизация пользователя
export const login = (email, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

// Регистрация нового пользователя
export const register = (full_name, email, password, phone) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ full_name, email, password, phone }),
  })

// Получить корзину пользователя (хранится на сервере)
export const getCart = (userId) => request(`/cart?user_id=${userId}`)

// Добавить услугу в корзину (или увеличить количество)
export const addToCart = (userId, serviceId) =>
  request('/cart', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, service_id: serviceId }),
  })

// Удалить позицию из корзины
export const removeFromCart = (cartItemId) =>
  request(`/cart/${cartItemId}`, { method: 'DELETE' })

// Очистить всю корзину пользователя
export const clearCart = (userId) =>
  request(`/cart/user/${userId}`, { method: 'DELETE' })

// Оформить заказ
export const createOrder = (userId, address, deliveryDate) =>
  request('/orders', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      address,
      delivery_date: deliveryDate,
    }),
  })

// Получить заказы пользователя с составом
export const getUserOrders = (userId) => request(`/orders/user/${userId}`)

// Оставить отзыв на услугу
export const createReview = (userId, serviceId, rating, comment) =>
  request('/reviews', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      service_id: serviceId,
      rating,
      comment,
    }),
  })

// Обновить профиль пользователя
export const updateProfile = (userId, data) =>
  request(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

// Сменить пароль пользователя
export const changePassword = (userId, oldPassword, newPassword) =>
  request(`/users/${userId}/password`, {
    method: 'PUT',
    body: JSON.stringify({ oldPassword, newPassword }),
  })
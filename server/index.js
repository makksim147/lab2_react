import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { pool } from './db.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.name,
        s.description,
        s.duration,
        s.price,
        s.image,
        c.name AS category
      FROM services s
      LEFT JOIN categories c ON c.id = s.category_id
      ORDER BY s.id
    `)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.get('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params

    const serviceResult = await pool.query(`
      SELECT 
        s.id, s.name, s.description, s.duration, s.price, s.image,
        c.name AS category
      FROM services s
      LEFT JOIN categories c ON c.id = s.category_id
      WHERE s.id = $1
    `, [id])

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Услуга не найдена' })
    }

    const reviewsResult = await pool.query(`
      SELECT 
        r.id, r.rating, r.comment, r.created_at,
        u.full_name AS user_name
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.service_id = $1
      ORDER BY r.created_at DESC
    `, [id])

    res.json({
      ...serviceResult.rows[0],
      reviews: reviewsResult.rows,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' })
  }

  try {
    const result = await pool.query(
      'SELECT id, full_name, email, phone, role_id FROM users WHERE email = $1 AND password = $2',
      [email, password]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный email или пароль' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.post('/api/auth/register', async (req, res) => {
  const { full_name, email, password, phone } = req.body || {}

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'Имя, email и пароль обязательны' })
  }

  if (password.length < 5) {
    return res.status(400).json({ error: 'Пароль должен быть не менее 5 символов' })
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' })
    }

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password, phone, role_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, phone, role_id`,
      [full_name, email, password, phone || null, 2]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.get('/api/cart', async (req, res) => {
  const { user_id } = req.query

  if (!user_id) {
    return res.status(400).json({ error: 'user_id обязателен' })
  }

  try {
    const result = await pool.query(`
      SELECT 
        ci.id,
        ci.qty,
        s.id AS service_id,
        s.name,
        s.price,
        s.image,
        s.duration
      FROM cart_items ci
      JOIN services s ON s.id = ci.service_id
      WHERE ci.user_id = $1
      ORDER BY ci.id
    `, [user_id])

    const total = result.rows.reduce(
      (sum, item) => sum + Number(item.price) * item.qty,
      0
    )

    res.json({ items: result.rows, total })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.post('/api/cart', async (req, res) => {
  const { user_id, service_id } = req.body || {}

  if (!user_id || !service_id) {
    return res.status(400).json({ error: 'user_id и service_id обязательны' })
  }

  try {
    const result = await pool.query(`
      INSERT INTO cart_items (user_id, service_id, qty)
      VALUES ($1, $2, 1)
      ON CONFLICT (user_id, service_id)
      DO UPDATE SET qty = cart_items.qty + 1
      RETURNING *
    `, [user_id, service_id])

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.delete('/api/cart/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE id = $1', [req.params.id])
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.delete('/api/cart/user/:userId', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [req.params.userId])
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.post('/api/orders', async (req, res) => {
  const { user_id, address, delivery_date } = req.body || {}

  if (!user_id || !address || !delivery_date) {
    return res.status(400).json({ error: 'Все поля обязательны' })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (new Date(delivery_date) < today) {
    return res.status(400).json({ error: 'Дата доставки не может быть в прошлом' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const cartResult = await client.query(`
      SELECT ci.service_id, ci.qty, s.price
      FROM cart_items ci
      JOIN services s ON s.id = ci.service_id
      WHERE ci.user_id = $1
    `, [user_id])

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(400).json({ error: 'Корзина пуста' })
    }

    const total = cartResult.rows.reduce(
      (sum, item) => sum + Number(item.price) * item.qty,
      0
    )

    const orderResult = await client.query(`
      INSERT INTO orders (user_id, address, delivery_date, total, status)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING id
    `, [user_id, address, delivery_date, total])

    const orderId = orderResult.rows[0].id

    for (const item of cartResult.rows) {
      await client.query(`
        INSERT INTO order_items (order_id, service_id, qty, price)
        VALUES ($1, $2, $3, $4)
      `, [orderId, item.service_id, item.qty, item.price])
    }

    await client.query('DELETE FROM cart_items WHERE user_id = $1', [user_id])

    await client.query('COMMIT')
    res.status(201).json({ order_id: orderId, total })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  } finally {
    client.release()
  }
})

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const ordersResult = await pool.query(`
      SELECT id, address, delivery_date, status, total, created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [req.params.userId])

    const orders = []
    for (const order of ordersResult.rows) {
      const itemsResult = await pool.query(`
        SELECT 
          oi.qty, oi.price,
          s.name AS service_name
        FROM order_items oi
        JOIN services s ON s.id = oi.service_id
        WHERE oi.order_id = $1
      `, [order.id])

      orders.push({ ...order, items: itemsResult.rows })
    }

    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.post('/api/reviews', async (req, res) => {
  const { user_id, service_id, rating, comment } = req.body || {}

  if (!user_id || !service_id || !rating) {
    return res.status(400).json({ error: 'user_id, service_id и rating обязательны' })
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Оценка должна быть от 1 до 5' })
  }

  try {
    const result = await pool.query(`
      INSERT INTO reviews (user_id, service_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [user_id, service_id, rating, comment || null])

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.put('/api/users/:id', async (req, res) => {
  const { full_name, email, phone, address } = req.body || {}

  try {
    const result = await pool.query(`
      UPDATE users
      SET full_name = $1, email = $2, phone = $3, address = $4
      WHERE id = $5
      RETURNING id, full_name, email, phone, address, role_id
    `, [full_name, email, phone, address, req.params.id])

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.put('/api/users/:id/password', async (req, res) => {
  const { oldPassword, newPassword } = req.body || {}

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Оба пароля обязательны' })
  }

  if (newPassword.length < 5) {
    return res.status(400).json({ error: 'Новый пароль — минимум 5 символов' })
  }

  try {
    const check = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND password = $2',
      [req.params.id, oldPassword]
    )

    if (check.rows.length === 0) {
      return res.status(401).json({ error: 'Старый пароль неверный' })
    }

    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [newPassword, req.params.id]
    )

    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})
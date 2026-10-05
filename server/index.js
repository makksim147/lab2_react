import 'dotenv/config'
import express from "express"
import cors from "cors"
import { pool } from "./db.js"

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({message: "API ЗАПУСТИЛСЯ"})
})

app.get('/api/services', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM SERVICES ORDER BY id')
        res.json(result.rows)
    }

    catch (err) {
        console.error(err)
        res.status(500).json({error: "Ошибка сервера"})
    }
})

app.post('/api/auth/login', async (req,res) => {
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({error: "Email и пароль являются обязательными!"})
    }

    try {
        const result = await pool.query(
            "SELECT id, email, role_id FROM users WHERE email = $1 AND password = $2",
            [email, password]
        )

        if (result.rows.length === 0) {
            return res.status(401).json({error: "Неверный email или пароль"})
        }

        res.json(result.rows[0])
    }
    catch (err) {
        console.error(err)
        res.status(500).json({error: "Ошибка сервера"})
    }
})

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' })
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
      `INSERT INTO users (email, password, role_id)
       VALUES ($1, $2, $3)
       RETURNING id, email, role_id`,
      [email, password, 1]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('ОШИБКА REGISTER:', err.message)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Сервен запущен на порту ${PORT}`)
})
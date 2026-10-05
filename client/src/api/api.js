

const BASE_URL = "http://localhost:5000/api"

export async function getService() {
    const res = await fetch(`${BASE_URL}/services`)
    if (!res.ok) throw new Error("Не удалось выгрузить товары")
    return res.json()
}

export async function login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.Error || "Ошибка авторизации")
    return data
}
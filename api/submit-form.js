const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

const sizePrices = {
    '155x210': 1250,
    '175x210': 1350,
    '200x220': 1500,
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Only POST allowed" });
    }

    const { name, phone, address, size, quantity } = req.body;

    if (
        !name || !phone || !address ||
        !(size in sizePrices) || !quantity
    ) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    const total = sizePrices[size] * quantity;

    const order = { name, phone, address, size, quantity, total };

    try {
        const forwardRes = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ data: Buffer.from(JSON.stringify(order)).toString("base64") }),
        });

        forwardRes.ok ? res.status(200).json({ message: "Успіх! Ваше замовлення було прийняте." }) : res.status(502).json({ message: "Невдача! Не вдалося відправити замовлення..." });
    } catch (err) {
        console.error("Error forwarding to Google Script:", err);
        res.status(500).json({ message: "Помилка сервера" });
    }
}

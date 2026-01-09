const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin",
    "http://localhost:4200");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const dbConfig = {
  server: 'localhost', // или 127.0.0.1
  port: 1433,
  user: 'vika',
  password: 'password',
  database: 'sweet_shop',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let pool;

sql.connect(dbConfig)
  .then(p => {
    pool = p;
    console.log('Connected to MS SQL');
  })
  .catch(err => {
    console.error('DB connection failed:', err);
  });

app.get('/api/clients', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT ClientId, FullName, Phone, Email FROM Clients');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT OrderId, ClientId, OrderDate, DueDate, Status, Comment
      FROM Orders
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT UserId, Login, PasswordHash, RoleId
      FROM Users
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/api/orders/:id/items', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const result = await pool.request()
      .input('orderId', sql.Int, orderId)
      .query(`
        SELECT ItemId, OrderId, ProductName, Ingredients, Decoration, Quantity
        FROM OrderItems
        WHERE OrderId = @orderId
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/orders', async (req, res) => {
  console.log(req.body); // Для отладки
  const { FullName, Phone, Email, OrderDate, DueDate, Status, Comment } = req.body;

  if (!FullName || !Phone || !OrderDate || !DueDate || !Status) {
    return res.status(400).json({ message: 'Не все данные переданы' });
  }

  try {
    let result = await pool.request()
      .input('phone', sql.NVarChar, Phone)
      .query(`SELECT ClientId FROM Clients WHERE Phone = @phone`);

    let clientId;

    if (result.recordset.length === 0) {
      result = await pool.request()
        .input('fullName', sql.NVarChar, FullName)
        .input('phone', sql.NVarChar, Phone)
        .input('email', sql.NVarChar, Email ?? null)
        .query(`
          INSERT INTO Clients (FullName, Phone, Email)
            OUTPUT INSERTED.ClientId
          VALUES (@fullName, @phone, @email)
        `);
      clientId = result.recordset[0].ClientId;
    } else {
      clientId = result.recordset[0].ClientId;
    }

    await pool.request()
      .input('clientId', sql.Int, clientId)
      .input('orderDate', sql.DateTime, new Date(OrderDate))
      .input('dueDate', sql.DateTime, new Date(DueDate))
      .input('status', sql.NVarChar, Status)
      .input('comment', sql.NVarChar, Comment ?? null)
      .query(`
        INSERT INTO Orders (ClientId, OrderDate, DueDate, Status, Comment)
        VALUES (@clientId, @orderDate, @dueDate, @status, @comment)
      `);

    res.status(201).json({ message: 'Заказ создан' });
  } catch (err) {
    console.error('Ошибка в POST /api/orders:', err);
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

app.post('/api/clients', async (req, res) => {
  const { fullName, phone, email } = req.body;
  if (!fullName || !phone) {
    return res.status(400).json({ message: 'Не все данные клиента переданы' });
  }

  try {
    const result = await pool.request()
      .input('fullName', sql.NVarChar, fullName)
      .input('phone', sql.NVarChar, phone)
      .input('email', sql.NVarChar, email ?? null)
      .query(`
        INSERT INTO Clients (FullName, Phone, Email)
        OUTPUT INSERTED.ClientId
        VALUES (@fullName, @phone, @email)
      `);

    const newClientId = result.recordset[0].ClientId;
    res.status(201).json({ clientId: newClientId });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка создания клиента' });
  }
});

app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) return res.status(400).json({ message: 'Введите логин и пароль' });

  try {
    const result = await pool.request()
      .input('login', sql.NVarChar, login)
      .query('SELECT UserId, Login, PasswordHash, RoleId FROM Users WHERE Login = @login');

    const user = result.recordset[0];
    if (!user) return res.status(401).json({ message: 'Неверный логин или пароль' });

    const storedHash = user.PasswordHash.trim(); // убираем пробелы с начала и конца
    const match = await bcrypt.compare(password, storedHash);

    if (!match) return res.status(401).json({ message: 'Неверный логин или пароль' });

    // Успешный вход
    res.json({ message: 'Вход успешен', userId: user.UserId, roleId: user.RoleId });
  } catch (e) {
    console.error('Ошибка в /api/login:', e);
      return res.status(500).json({ message: 'Нет подключения к базе данных' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

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

app.get('/api/orders/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const orderResult = await pool.request()
      .input('id', id)
      .query(`
        SELECT
          o.OrderId,
          o.OrderDate,
          o.DueDate,
          o.Status,
          o.Comment,
          c.FullName,
          c.Phone,
          c.Email
        FROM Orders o
               JOIN Clients c ON c.ClientId = o.ClientId
        WHERE o.OrderId = @id
      `);

    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const itemsResult = await pool.request()
      .input('id', id)
      .query(`
        SELECT
          ProductName,
          Decoration,
          Quantity
        FROM OrderItems
        WHERE OrderId = @id
      `);

    res.json({
      ...orderResult.recordset[0],
      Items: itemsResult.recordset
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const {
      fullName,
      phone,
      email,
      orderDate,
      dueDate,
      status,
      comment,
      items
    } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const request = pool.request();

    // 1️⃣ обновляем заказ
    await request
      .input('OrderId', sql.Int, orderId)
      .input('OrderDate', sql.DateTime, orderDate)
      .input('DueDate', sql.DateTime, dueDate)
      .input('Status', sql.NVarChar, status)
      .input('Comment', sql.NVarChar, comment)
      .query(`
        UPDATE Orders
        SET
          OrderDate = @OrderDate,
          DueDate = @DueDate,
          Status = @Status,
          Comment = @Comment
        WHERE OrderId = @OrderId
      `);

    // 2️⃣ обновляем клиента
    await pool.request()
      .input('FullName', sql.NVarChar, fullName)
      .input('Phone', sql.NVarChar, phone)
      .input('Email', sql.NVarChar, email)
      .input('OrderId', sql.Int, orderId)
      .query(`
        UPDATE Clients
        SET
          FullName = @FullName,
          Phone = @Phone,
          Email = @Email
        WHERE ClientId = (
          SELECT ClientId FROM Orders WHERE OrderId = @OrderId
        )
      `);

    // 3️⃣ обновляем позиции заказа
    await pool.request()
      .input('OrderId', sql.Int, orderId)
      .query(`DELETE FROM OrderItems WHERE OrderId = @OrderId`);

    for (const item of items) {
      await pool.request()
        .input('OrderId', sql.Int, orderId)
        .input('ProductName', sql.NVarChar, item.productName)
        .input('Decoration', sql.NVarChar, item.decoration)
        .input('Quantity', sql.Int, item.quantity)
        .query(`
          INSERT INTO OrderItems (OrderId, ProductName, Decoration, Quantity)
          VALUES (@OrderId, @ProductName, @Decoration, @Quantity)
        `);
    }

    res.json({ message: 'Order updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
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
  const { fullName, phone, email, orderDate, dueDate, status, comment, items } = req.body;

  if (!fullName || !phone || !orderDate || !dueDate || !status || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Не все данные переданы или нет позиций заказа' });
  }

  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const request = new sql.Request(transaction);

    // 1. Клиент
    let result = await request
      .input('phone', sql.NVarChar, phone)
      .query(`SELECT ClientId FROM Clients WHERE Phone = @phone`);

    let clientId;

    if (result.recordset.length === 0) {
      result = await request
        .input('fullName', sql.NVarChar, fullName)
        .input('email', sql.NVarChar, email ?? null)
        .query(`
          INSERT INTO Clients (FullName, Phone, Email)
            OUTPUT INSERTED.ClientId
          VALUES (@fullName, @phone, @email)
        `);
      clientId = result.recordset[0].ClientId;
    } else {
      clientId = result.recordset[0].ClientId;
    }

    // 2. Заказ
    const orderResult = await request
      .input('clientId', sql.Int, clientId)
      .input('orderDate', sql.DateTime, orderDate)
      .input('dueDate', sql.DateTime, dueDate)
      .input('status', sql.NVarChar, status)
      .input('comment', sql.NVarChar, comment ?? null)
      .query(`
        INSERT INTO Orders (ClientId, OrderDate, DueDate, Status, Comment)
          OUTPUT INSERTED.OrderId
        VALUES (@clientId, @orderDate, @dueDate, @status, @comment)
      `);

    const orderId = orderResult.recordset[0].OrderId;

    // 3. Items
    for (const item of items) {
      await request
        .input('orderId', sql.Int, orderId)
        .input('productName', sql.NVarChar, item.productName)
        .input('decoration', sql.NVarChar, item.decoration ?? null)
        .input('quantity', sql.Int, item.quantity)
        .query(`
          INSERT INTO OrderItems (OrderId, ProductName, Decoration, Quantity)
          VALUES (@orderId, @productName, @decoration, @quantity)
        `);
    }

    await transaction.commit();

    res.status(201).json({ message: 'Заказ успешно создан', orderId });

  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

app.get('/api/orders/:id/details', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId)) {
      return res.status(400).json({ message: 'Неверный ID заказа' });
    }

    const orderResult = await pool.request()
      .input('orderId', sql.Int, orderId)
      .query(`
        SELECT o.OrderId, c.FullName, c.Phone, o.OrderDate, o.DueDate, o.Status, o.Comment
        FROM Orders o
               JOIN Clients c ON o.ClientId = c.ClientId
        WHERE o.OrderId = @orderId
      `);

    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    const itemsResult = await pool.request()
      .input('orderId', sql.Int, orderId)
      .query(`
        SELECT ItemId, ProductName, Decoration, Quantity
        FROM OrderItems
        WHERE OrderId = @orderId
      `);

    const order = orderResult.recordset[0];
    order.Items = itemsResult.recordset;

    res.json(order);
  } catch (err) {
    console.error(err);
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

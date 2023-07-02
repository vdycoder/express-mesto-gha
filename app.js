const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { ERROR_CODE_404 } = require('./utils/status-codes');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '649fe68d3c7b0c3c3f49a923',
  };
  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('*', (req, res) => {
  res.status(ERROR_CODE_404).json({
    message: 'Несуществующий путь.',
  });
});

app.listen(PORT, () => {
  console.log(`App running & listening on port ${PORT}`);
});

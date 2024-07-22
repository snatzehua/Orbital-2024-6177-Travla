const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');
const PORT = process.env.PORT || 3001;

const app = express();

mongoose.connect('mongodb+srv://jiaming:orbital2024@travla.5qt8iwx.mongodb.net/travla?retryWrites=true&w=majority&appName=Travla')
.then(() => {
  const User = require('./models/user');
  // console.log('User Schema:', User.schema.paths);
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit the application if MongoDB connection fails
});

app.use(bodyParser.json());
app.use('/api', userRoutes);
app.use('/api', tripRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
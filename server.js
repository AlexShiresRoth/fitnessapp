const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

app.use(cors());

//connect database
connectDB();

//Init MiddleWare
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || '5000';

app.get('/', (req, res) => res.send('Fitness App API Running'));

app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/routines', require('./routes/api/routines'));
app.use('/api/profiles', require('./routes/api/profiles'));

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

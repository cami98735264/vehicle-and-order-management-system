const express = require('express');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/database/Connection');
const authRoutes = require('./routes/auth');
const obraRoutes = require('./routes/obra');
const vehiculoRoutes = require('./routes/vehiculo');
const asignacionObraRoutes = require('./routes/asignacionObra');
const cors = require('cors');
const userRoutes = require('./routes/user');

require('dotenv').config();

const app = express();


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/obras', obraRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/asignacionobras', asignacionObraRoutes);
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();

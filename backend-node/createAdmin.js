const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const MONGO_URI = 'mongodb://localhost:27017/adopcion_mascotas';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Conectado a MongoDB");

        const existingAdmin = await User.findOne({ role: 'administrador' });
        if (existingAdmin) {
            console.log("Ya existe un administrador:", existingAdmin.email);
            return mongoose.connection.close();
        }

        // Encriptar contraseña correctamente con bcryptjs
        const hashedPassword = await bcrypt.hash("123456", 10);

        const admin = new User({
            firstName: "Admin",
            lastName: "Principal",
            email: "admin@admin.com",
            password: hashedPassword,
            role: "administrador"
        });

        await admin.save();
        console.log("Administrador creado correctamente:", admin._id);

        mongoose.connection.close();
    })
    .catch(err => {
        console.error(err);
        mongoose.connection.close();
    });


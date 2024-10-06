const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

// Middleware para permitir recibir datos en formato JSON
app.use(express.json());

app.get("/", (req, res) => { res.sendFile(path.join(__dirname, './', 'index.html'))});

// Función para leer el archivo repertorio.json
const leerRepertorio = () => {
    const data = fs.readFileSync('repertorio.json', 'utf-8');
    return JSON.parse(data);
};

// Función para escribir en el archivo repertorio.json
const escribirRepertorio = (data) => {
    fs.writeFileSync('repertorio.json', JSON.stringify(data, null, 2), 'utf-8');
};

// POST /canciones: Agregar una canción al repertorio
app.post('/canciones', (req, res) => {
    const repertorio = leerRepertorio();
    const nuevaCancion = req.body;
    repertorio.push(nuevaCancion);
    escribirRepertorio(repertorio);
    res.status(201).send('Canción agregada con éxito');
});

//GET /canciones: Listar todas las canciones
app.get('/canciones', (req, res) => {
    const repertorio = leerRepertorio();
    res.json(repertorio);
});

// PUT /canciones/:id: Actualizar una canción
app.put('/canciones/:id', (req, res) => {
    const repertorio = leerRepertorio();
    const { id } = req.params;
    const index = repertorio.findIndex(cancion => cancion.id == id);

    if (index !== -1) {
        repertorio[index] = { ...repertorio[index], ...req.body };
        escribirRepertorio(repertorio);
        res.send('Canción actualizada con éxito');
    } else {
        res.status(404).send('Canción no encontrada');
    }
});

// DELETE /canciones/:id: Eliminar una canción
app.delete('/canciones/:id', (req, res) => {
    const repertorio = leerRepertorio();
    const { id } = req.params;
    const nuevasCanciones = repertorio.filter(cancion => cancion.id != id);

    if (repertorio.length !== nuevasCanciones.length) {
        escribirRepertorio(nuevasCanciones);
        res.send('Canción eliminada con éxito');
    } else {
        res.status(404).send('Canción no encontrada');
    }
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});



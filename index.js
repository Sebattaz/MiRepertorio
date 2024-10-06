const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

// Middleware
app.use(express.json());

app.get("/", (req, res) => { res.sendFile(path.join(__dirname, './', 'index.html'))});


const leerRepertorio = () => {
    const data = fs.readFileSync('repertorio.json', 'utf-8');
    return JSON.parse(data);
};

// Funcion para escribir en el archivo
const escribirRepertorio = (data) => {
    fs.writeFileSync('repertorio.json', JSON.stringify(data, null, 2), 'utf-8');
};

//Agregar una canción al repertorio
app.post('/canciones', (req, res) => {
    const repertorio = leerRepertorio();
    const nuevaCancion = req.body;
    repertorio.push(nuevaCancion);
    escribirRepertorio(repertorio);
    res.status(201).send('Canción agregada con éxito');
});

//Listar todas las canciones
app.get('/canciones', (req, res) => {
    const repertorio = leerRepertorio();
    res.json(repertorio);
});

//Actualizar una cancion
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

//Eliminar una cancion
app.delete('/canciones/:id', (req, res) => {
    const repertorio = leerRepertorio();
    const { id } = req.params;
    const nuevasCanciones = repertorio.filter(cancion => cancion.id != id);

    if (repertorio.length !== nuevasCanciones.length) {
        escribirRepertorio(nuevasCanciones);
        res.send('Cancion eliminada con éxito');
    } else {
        res.status(404).send('Cancion no encontrada');
    }
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor levantado');
});



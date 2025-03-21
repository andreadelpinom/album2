var express = require('express');
var router = express.Router();


//const Sequelize = require('sequelize');
const { Sequelize, Op } = require('sequelize');
const Foto = require('../models').foto; 
const Etiqueta = require('../models').etiqueta; 

router.get('/findAll/json', function(req, res, next) {

    Foto.findAll({
    attributes: { exclude:
    ["updatedAt"] }
    })
    .then(fotos => {
    res.json(fotos);
    })
    .catch(error =>
    res.status(400).send(error))
});

router.get('/findAll/view', function(req, res, next) {
    Foto.findAll({
    attributes: { exclude: ["updatedAt"] },
    include: [{
        model: Etiqueta,
        attributes: ['texto'],
        through: {attributes: []}
        }],
    })
    .then(fotos => {
    res.render('fotos', { title: 'Fotos', arrFotos: fotos });
    })
    .catch(error => res.status(400).send(error))

 
});

router.get('/findAllByRate/json', function (req, res, next) {
    let lower = parseFloat(req.query.lower);
    let higher = parseFloat(req.query.higher);

    Foto.findAll({
        attributes: {
            exclude:
                ["updatedAt"]
        },
        include: [{
            model: Etiqueta,
            attributes: ['texto'],
            through: { attributes: [] }
        }],
        where: {
            calificacion: {
                [Op.between]: [lower, higher]
            }
        }
    })
        .then(fotos => {
             res.json(fotos);
        })
        .catch(error =>
             res.status(400).send(error))
});

// Nueva ruta para mostrar fotos filtradas por calificación en vista
router.get('/findAllByRate/view', function (req, res, next) {
    let lower = parseFloat(req.query.lower || 0);
    let higher = parseFloat(req.query.higher || 5);

    Foto.findAll({
        attributes: { exclude: ["updatedAt"] },
        include: [{
            model: Etiqueta,
            attributes: ['texto'],
            through: { attributes: [] }
        }],
        where: {
            calificacion: {
                [Op.between]: [lower, higher]
            }
        }
    })
        .then(fotos => {
            res.render('fotoRango', { 
                title: 'Fotos por Calificación', 
                arrFotos: fotos,
                lower: lower,
                higher: higher
            });
        })
        .catch(error => res.status(400).send(error))
});

router.get('/findAll/json', function (req, res, next) {
    Foto.findAll({
        attributes: { exclude: ["updatedAt", "createdAt"] },
        include: [{
            model: Etiqueta,
            attributes: ['texto'],
            through: { attributes: [] }
        }]
    })
    .then(fotos => {
        res.json(fotos);
    })
    .catch(error => {
        res.status(400).send(error);
    });
});

router.get('/findById/:id/json', function (req, res, next) {
    let id = parseInt(req.params.id);

    Foto.findAll({
        attributes: { exclude: ["updatedAt", "createdAt"] },
        include: [{
            model: Etiqueta,
            attributes: ['texto'],
            through: { attributes: [] }
        }],
        where: {
            [Op.and]: [{ id: id }]
        }
    })
    .then(fotos => {
        res.json(fotos);
    })
    .catch(error => {
        res.status(400).send(error);
    });
});

router.post('/save', function(req, res, next) {
    let { titulo, descripcion, calificacion, ruta } = req.body;

    Foto.create({
        titulo: titulo,
        descripcion: descripcion,
        calificacion: parseFloat(calificacion), // Asegurarse de que sea un número
        ruta: ruta,
        createdAt: new Date(),
        updatedAt: new Date()
    })
    .then(foto => {
        res.json(foto); // Devolver la respuesta en formato JSON
    })
    .catch(error => {
        res.status(400).send(error); // Manejar errores con un estado 400
    });
});

router.put('/update', function(req, res, next) {
    let { id, titulo, descripcion, calificacion, ruta } = req.body;

    Foto.update(
        {
            titulo: titulo,
            descripcion: descripcion,
            calificacion: parseFloat(calificacion), // Asegurarse de que sea un número
            ruta: ruta,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            where: {
                id: parseInt(id) // Convertir 'id' a entero
            }
        }
    )
    .then(respuesta => {
        res.json(respuesta); // Devolver la respuesta en formato JSON
    })
    .catch(error => {
        res.status(400).send(error); // Manejar errores con un estado 400
    });
});

router.delete('/delete/:id', function(req, res, next) {
    let id = parseInt(req.params.id);

    Foto.destroy({
        where: {
            id: id
        }
    })
    .then(respuesta => {
        res.json({ 
            status: "success", 
            message: "Foto eliminada correctamente", 
            registrosEliminados: respuesta 
        }); // Devolver la respuesta en formato JSON
    })
    .catch(error => {
        res.status(400).send(error); // Manejar errores con un estado 400
    });
});







module.exports = router;

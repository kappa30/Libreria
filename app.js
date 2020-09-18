const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const uri = "mongodb+srv://matias:67254729@cluster0.wromb.mongodb.net/libreria?retryWrites=true&w=majority";
async function conectar()
{
    try
    {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Conectado a la base de datos metodo: mongoodb - async-await");
    }
    catch (e)
    {
        console.log(e);
    }
};
conectar();

const GeneroSchema = new mongoose.Schema
    ({
        nombre: String,
        deleted: Boolean
    });

const GeneroModel = mongoose.model("generos", GeneroSchema);

const LibroSchema = new mongoose.Schema
    ({
        nombre: String,
        autor: String,
        genero:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'generos'
        },
        prestado: String
    });

const LibroModel = mongoose.model("libros", LibroSchema);

// LIBROS
app.get('/libro', (req, res) =>
{

    try
    {
        LibroModel.find((error, resultado) =>
        {
            if (error) throw new Error(error)
            if (resultado)
            {
                res.status(200).send(resultado);
            }
            else
            {
                res.status(422).send({ message: 'No se encontraron valores' });
            }
        });
    }
    catch (e)
    {
        console.log(e);
        res.status(422).send({ error: e });
    }
});
app.get('/libro/:id', (req, res) =>
{
    try
    {
        let id = req.params.id;

        if (checkEmptyValue(id))
        {
            throw new Error('Error al leer el id');
        }

        LibroModel.findById(id, (errFind, resFind) =>
        {
            if (errFind) throw new Error(errFind)
            res.status(200).send(resFind);
        });
    }
    catch (e)
    {
        res.status(422).send({ error: e });
    }

});
app.post('/libro', (req, res) =>
{
    try
    {
        let nombre = req.body.nombre;
        let autor = req.body.autor;
        let genero = req.body.genero;
        let prestado = "";

        if (checkEmptyValue(nombre))
        {
            throw new Error('Error al leer el nombre');
        }
        if (checkEmptyValue(autor))
        {
            throw new Error('Error al leer el autor');
        }
        if (checkEmptyValue(genero))
        {
            throw new Error('Error al leer el genero');
        }

        // me falta ver como mandar el genero de la tabla generos

        let libro =
        {
            nombre: nombre,
            autor: autor,
            genero: genero,
            prestado: prestado,
        }

        LibroModel.create(libro, (errCreate, resCreate) =>
        {
            if (errCreate) throw new Error(errCreate)
            if (resCreate)
            {
                res.status(200).send(resCreate);
            }
        });
    }
    catch (e)
    {
        res.status(422).send({ error: e });
    }
});
app.delete("/libro/:id", (req, res) =>
{
    try
    {
        let id = req.params.id;

        if (checkEmptyValue(id))
        {
            throw new Error('Error al leer el id');
        }

        LibroModel.findByIdAndDelete(id, (errFind, resFind) =>
        {
            if (errFind) throw new Error(errFind)
            if (resFind)
            {
                res.status(200).send({ message: "Se borro correctamente" });
            }
        });
    }
    catch (e)
    {
        console.log(e);
        res.status(422).send({ error: e });
    }
});
app.put("/libro/:id", (req, res) =>
{
    try
    {
        let id = req.params.id;
        let nombre = req.body.nombre;
        let autor = req.body.autor;
        let genero = req.body.genero;
        let prestado = req.body.prestado;

        if (checkEmptyValue(id))
        {
            throw new Error('Error al leer el id');
        }
        if (checkEmptyValue(nombre))
        {
            throw new Error('Error al leer el nombre');
        }
        if (checkEmptyValue(autor))
        {
            throw new Error('Error al leer el autor');
        }
        if (checkEmptyValue(genero))
        {
            throw new Error('Error al leer el genero');
        }

        let libro =
        {
            nombre: nombre,
            autor: autor,
            genero: genero,
            prestado: prestado,
        }

        LibroModel.findByIdAndUpdate(id, libro, { new: true }, (errFind, resFind) =>
        {
            if (errFind) throw new Error(errFind)
            if (resFind)
            {
                res.status(200).send(resFind);
            }
        });
    }
    catch (e)
    {
        console.log(e);
        res.status(422).send({ error: e });
    }
});

// GENEROS 
app.get('/genero', (req, res) =>
{
    try
    {
        GeneroModel.find({ deleted: 0 }, (errFind, resFind) =>
        {
            if (errFind) throw new Error(errFind)
            if (resFind)
            {
                res.status(200).send(resFind);
            }
        });
    }
    catch (e)
    {
        console.log(e);
        res.status(422).send({ error: e });
    }
});
app.get('/genero/:id', (req, res) =>
{
    try
    {
        let id = req.params.id;

        if (checkEmptyValue(id))
        {
            throw new Error('Error al leer el id');
        }

        GeneroModel.findById(id, (errFind, resFind) =>
        {
            if (errFind) throw new Error(errFind)
            if (resFind)
            {
                res.status(200).send(resFind);
            }
        });
    }
    catch (e)
    {
        console.log(e);
        res.status(422).send({ error: e });
    }
});
app.post('/genero', (req, res) =>
{
    try
    {
        let nombre = req.body.nombre;

        if (checkEmptyValue(nombre))
        {
            throw new Error('Error al leer el nombre');
        }

        GeneroModel.find({ nombre: nombre.toUpperCase() }, (errFind, resFind) =>
        {
            if (errFind) throw new Error(errFind)
            if (resFind)
            {
                throw new Error('ya existe un genero con el nombre: ' + nombre);
            }
            else
            {
                // si se superan las comprobaciones se pasa a crear el genero
                let genero =
                {
                    nombre: nombre.toUpperCase(),
                    deleted: 0
                }
                GeneroModel.create(genero, (errCreate, resCreate) =>
                {
                    if (errCreate) throw new Error(errCreate)
                    if (resCreate)
                    {
                        res.status(200).send(genero);
                    }
                });
            }
        });
    }
    catch (e)
    {
        console.log(e);
        res.status(422).send({ message: e });
    }
});
app.delete('/genero/:id', (req, res) =>
{
    try
    {
        let id = req.params.id;

        GeneroModel.findById(id, (errFind, resFind) =>
        {
            if (errFind) throw new Error(errFind)
            if (resFind)
            {
                // se hace la eliminacion logica del genero devuelto en el find
                resFind.deleted = 1;
                GeneroModel.findByIdAndUpdate(id, resFind);
                res.status(200).send({ message: "Se borro genero" });
            }
        });
    }
    catch (e)
    {
        console.log(e);
        res.status(422).send({ error: e });
    }
});
app.put('/genero/:id', (req, res) =>
{
    try
    {
        let id = req.params.id;
        let nombre = req.body.nombre;

        if (checkEmptyValue(id))
        {
            throw new Error('Error al leer el id');
        }

        if (checkEmptyValue(nombre))
        {
            throw new Error('Error al leer el nombre');
        }

        // Se verifica que no exista otro genero con el nuevo nombre por el que se desea modificar.-
        GeneroModel.find({ nombre: nombre }, (errFindGenero, resFindGenero) =>
        {
            if (errFindGenero) throw new Error(errFindGenero)
            if (resFindGenero)
            {
                throw new Error("Ya existe ese genero");
            }
            else
            {
                // Se verifica si existen libros ya cargados con este genero o no.-
                LibroModel.find({ genero: id }, (errFindLibro, resFindLibro) =>
                {
                    if (errFindLibro) throw new Error(errFindLibro)
                    if (resFindLibro)
                    {
                        throw new Error("No se puede modificar, hay libros asociados");
                    }
                    else
                    {
                        // Si se superan todas las comprobaciones se procede a actualizar el nombre del genero.-
                        let generoModificado =
                        {
                            nombre: nombre
                        }
                        GeneroModel.findByIdAndUpdate(id, generoModificado);
                        res.status(200).send({ message: 'Se actualizo correctamente el genero' });
                    }
                });
            }
        });
    }
    catch (e)
    {
        console.log(e);
        res.status(422).send({ error: e });
    }
});

// UTILS ------------------------------------------------------------------------------------------------- //
/**
 * Chequea si un valor es 'undefined' o 'empty'.-
 * @param {*} value 
 * @returns true or false
 */
function checkEmptyValue(value)
{
    if (value == undefined || value == '')
    {
        return true;
    }
    return false;
}

// SERVER START --------------------------------------------------------------------------------------------- //
app.listen(3000, () =>
{
    console.log("Servidor escuchando en el puerto 3000");
});

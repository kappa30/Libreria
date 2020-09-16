const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const uri = "mongodb+srv://matias:67254729@cluster0.wromb.mongodb.net/libreria?retryWrites=true&w=majority";
async function conectar() {
    try{
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Conectado a la base de datos metodo: mongoodb - async-await");
    }
    catch(e){
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


app.get('/libro', async (req, res)=>{
   
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
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
}); 

app.get('/libro/:id', async(req, res)=>{
    try{
    let id = req.params.id;
    let respuesta = null;
    respuesta =  await LibroModel.findById(id);

    res.status(200).send(respuesta);
    }
    catch(e){
        res.status(422).send({error: e});
    }        

});

app.post('/libro', (req, res) =>{
    try{
    let nombre = req.body.nombre;
    let autor = req.body.autor;
    let genero = req.body.genero;
    let prestado = "";

    if(nombre === undefined){
        throw new Error('No enviaste nombre'+e);
    }

    if(nombre ==''){
        throw new Error('El nombre no puede estar vacio'+e);
    }

    if(autor === undefined){
        throw new Error('No enviaste autor'+e);
    }

    if(autor ==''){
        throw new Error('El autor no puede estar vacio'+e);
    }

    if(genero === undefined){
        throw new Error('No enviaste genero'+e);
    }

    if(genero ==''){
        throw new Error('El genero no puede estar vacio'+e);
    }

        // me falta ver como mandar el genero de la tabla generos

        let libro =
                {
                    nombre: nombre,
                    autor: autor,
                    genero: genero,
                    prestado: prestado,
                }
                
                LibroModel.create(libro)

    res.status(200).send('El libro que enviaste es '+nombre+' y se mando correctamente ');
    }
    catch(e){
        res.status(422).send('Hubo un error '+e);
    }
});

app.delete("/libro/:id", async (req, res) => {
    try{
        let id = req.params.id;
        await LibroModel.findByIdAndDelete(id);
        res.status(200).send({message: "Se borro correctamente"});
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});


// GENEROS 
app.get('/genero', async (req, res)=>{
    try{
        let respuesta = null;
        respuesta = await GeneroModel.find({deleted: 0});
        res.status(200).send(respuesta);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});
app.get('/genero/:id', async (req, res)=>{
    try{
        let id = req.params.id;
        let respuesta = null;        
        respuesta = await GeneroModel.findById(id);
        res.status(200).send(respuesta);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});
app.post('/genero', async (req, res)=>{
    try{
        let nombre = req.body.nombre;
        if(nombre == undefined){
            throw new Error('Tenes que enviar un nombre');
        }
        if(nombre == ''){
            throw new Error('El nombre no puede ser vacio');
        }
        
        let existeNombre = null;
        existeNombre =  await GeneroModel.find({nombre: nombre.toUpperCase()});
        if(existeNombre.length > 0){
            throw new Error('Ese genero ya existe');
        }
        let genero = {
            nombre:  nombre.toUpperCase(),
            deleted: 0
        }
        await GeneroModel.create(genero);
        res.status(200).send(genero);
    }
    catch(e){
        console.log(e);
        res.status(422).send({ message: 'Este genero ya esta cargado' });
    }
});
app.delete('/genero/:id', async (req, res)=>{
    try{
        let id = req.params.id;
        let respuesta = null;
        let generoGuardado = await GeneroModel.findById(id);
        generoGuardado.deleted = 1;
        await GeneroModel.findByIdAndUpdate(id, generoGuardado);
        res.status(200).send({"message": "Se borro genero"});
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});
app.put('/genero/:id', async (req, res)=>{
    try{
        // Validacion de datos
        let nombre = req.body.nombre;
        let id = req.params.id;
        if(nombre == undefined){
            throw new Error('Tenes que enviar un nombre');
        }
        if(nombre == ''){
            throw new Error('El nombre no puede ser vacio');
        }
        // Verificamos condiciones para poder modificar
        let generoExiste = await GeneroModel.find({"nombre": nombre});
        if(generoExiste.length > 0){
            generoExiste.forEach(unGenero => {
                if(unGenero.id != id){
                    throw new Error("Ya existe ese genero");
                }
            });
        }
        let librosConEseGenero = null;
        librosConEseGenero = await LibroModel.find({"genero": id});
        if(librosConEseGenero.length > 0){
            throw new Error("No se puede modificar, hay libros asociados");
        }
        let generoModificado = {
            nombre: nombre
        }
        await GeneroModel.findByIdAndUpdate(id, generoModificado);
        res.status(200).send(generoModificado);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});


app.listen(3000, ()=>{
    console.log("Servidor escuchando en el puerto 3000");
});

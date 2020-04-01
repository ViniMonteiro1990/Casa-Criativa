const express = require ('express');//express serve para criar e configurar o servidor
const server = express()

const db = require('./db')
/*
const ideias = [
    {
        img: "https://image.flaticon.com/icons/svg/2729/2729007.svg",
        title:"Curso de Programação",
        category:"Estudo",
        description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        url:"https://rocketseat.com.br"
    },
    {
        img: "https://image.flaticon.com/icons/svg/2729/2729005.svg",
        title:"Exercícios",
        category:"Saúde",
        description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        url:"https://rocketseat.com.br"
    },
    {
        img: "https://image.flaticon.com/icons/svg/2729/2729027.svg",
        title:"Meditação",
        category:"Mentalidade",
        description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        url:"https://rocketseat.com.br"
    },
    {
        img: "https://image.flaticon.com/icons/svg/2424/2424779.svg",
        title:"Karaokê",
        category:"Diversão em Familia",
        description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        url:"https://rocketseat.com.br"
    },


]*/
server.use(express.static('public'))///configurar arquivos estaticos (css,scrips,imagens)
//habilitar uso do req.body
server.use(express.urlencoded({extended: true}))
//config. nunjucks
const nunjucks = require ('nunjucks')
nunjucks.configure('views', {
    express: server,
    noCache:true,
})

//criar uma rota /
//e capturar o pedido do cliente para responder
server.get('/',function(req,res){

    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err){
            console.log(err)
            return res.send('Erro no banco de dados!!')
        }

        const reverseIdeas = [...rows].reverse()

        let lastIdeas=[]
    
        for (ideia of reverseIdeas){
            if (lastIdeas.length < 2){
               lastIdeas.push(ideia) 
            }
        }
    
        //lastIdeas = lastIdeas.reverse()pegar as ultimas ideias e reverter..e colocar de volta no lastIdeias
    
        return res.render( "index.html",{ideias: lastIdeas})
    })

        
    })

   
server.get('/ideias',function(req,res){

    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err){
            console.log(err)
            return res.send('Erro no banco de dados!!')
        }

    const reverseIdeas = [...rows].reverse()

    return res.render("ideias.html", {ideias: reverseIdeas})
    })
})
//para pegar a resposta do formulario e salvar no Banco de dados
server.post('/',function(req,res){
    db.run(
        `CREATE TABLE IF NOT EXISTS ideas(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image TEXT,
            title TEXT,
            category TEXT,
            description TEXT,
            link TEXT        
        );
    `)

    //inserir dados na tabela
    const query = `
        INSERT INTO ideas(
            image,
            title,
            category,
            description,
            link
        ) VALUES (?,?,?,?,?);
    `
    const values = [
       req.body.image,
       req.body.title,
       req.body.category,
       req.body.description,
       req.body.link,
    ]
    db.run(query,values,function(err){
        if (err){
            console.log(err)
            return res.send('Erro no banco de dados!!')
        }

        return res.redirect('/ideias')
    })
})


server.listen(3000)
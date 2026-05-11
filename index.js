import express from 'express';
import path from "path";
import mongodb from "mongodb";
import { MongoClient, ObjectId } from 'mongodb';
const dbname  = "node_project";
const cname = "todo";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const app = express();
const mypublic = path.resolve('public');

app.use(express.json());
app.use(express.static(mypublic));
app.use(express.urlencoded({extended: true}));
app.set("view engine","ejs");

const connected = async () =>{
  await client.connect();
  return client.db(dbname).collection(cname);
}

app.get('/',(req,res)=>{
  res.render("lists");
})

app.get('/add',(req,res)=>{
  res.render("add");
})

app.get('/update',(req,res)=>{
  res.render("update");
})

app.post('/add_task',(req,res)=>{

let result =  connected().then((collection)=>{
    collection.insertOne(req.body);
  })

  if(result){
    res.redirect("/");
  }else{
     res.redirect("/add");
  }

 

})

app.listen(8080,()=>{
  console.log("server is running in 8080");
  
})
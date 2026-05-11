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

app.get('/', async (req,res)=>{
  let result = await connected().then((collection)=>{
   return collection.find({}).toArray();
  });

  
  
  res.render("lists",{data: result});
})

app.get('/add',(req,res)=>{
  res.render("add");
})

app.get('/update',(req,res)=>{
  res.render("update", { data: null });
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

app.get("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id.trim();

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "invalid id format", id });
    }

    const collection = await connected();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return res.redirect("/");
    } else {
      return res.status(404).send({ message: "not found" });
    }
  } catch (err) {
    console.error("Delete error:", err); // important for real cause
    return res.status(500).send({ message: "server error" });
  }
});

app.get('/update/:id',async (req,res)=>{
   try {
    const id = req.params.id.trim();

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "invalid id format", id });
    }

    const collection = await connected();
    const result = await collection.findOne({ _id: new ObjectId(id) });

    if (result) {
      return res.render("update", { data: result });
    } else {
      return res.status(404).send({ message: "not found" });
    }
  } catch (err) {
    console.error("Delete error:", err); // important for real cause
    return res.status(500).send({ message: "server error" });
  }
})

app.post("/update_task/:id",async (req,res)=>{
  const id = req.params.id.trim();
  const collection = await connected();
  const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: req.body });
  if (result.modifiedCount === 1) {
    return res.redirect("/");
  } else {
    return res.status(404).send({ message: "not found" });
  }
})

app.listen(8080,()=>{
  console.log("server is running in 8080");
  
})

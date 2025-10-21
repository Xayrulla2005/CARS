const express= require("express")
require("dotenv").config()
const conectedDB=require("./config/db")


const app=express()
app.use(express.json())




conectedDB()








const PORT=process.env.PORT || 3000
app.listen(PORT,()=>console.log(`Server is runing: ${PORT}`))

import app from "./server"

const PORT = 3000

app.listen(PORT, ()=>{
    console.log(`The server is run on port ${PORT}`)
})
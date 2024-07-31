import app from "./server"

const port = process.env.PORT || 3000
console.log(port)

app.listen(port, ()=>{
    console.log(`The server is run on port ${port}`)
})
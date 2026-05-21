const app = require('./src/app')
const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`WarrantySafe backend running on http://localhost:${PORT}`)
})
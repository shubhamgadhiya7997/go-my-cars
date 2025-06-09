const express = require("express");
require("dotenv").config();
const db = require("./DB/database");
const app = express();
const cors = require("cors");
const multer = require('multer');
const user = require("./routes/Api/user");
const car = require("./routes/Api/car");
const carBanner = require("./routes/Api/banner");
const booking  = require("./routes/Api/booking");
const support = require("./routes/Api/support");
const partner = require("./routes/Api/partner");
const setting = require("./routes/Api/setting");
const admin = require("./routes/Api/admin");
const cron = require("node-cron");
const { carBooking } = require("./routes/controller/booking");
const path = require('path');
const { sendnotificationCheck } = require("./routes/controller/admin");
const redis = require('redis');

// const Redis = require("ioredis");

multer({dest: "uploads/"});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'uploads')))

app.use(cors());
// app.use(
//     cors({
//       origin: [
//         "http://localhost:3000",
//       ],
//     })
//   );

cron.schedule("0 0 * * *", function() {
    carBooking()
});
// sendnotificationCheck()
const port = process.env.PORT || 3000

app.get("/", (req,res) => {
    res.send("This api is working")
})

app.use("/api",user);
app.use("/api",car);
app.use("/api",carBanner);
app.use("/api",booking);
app.use("/api",support);
app.use("/api",partner);
app.use("/api",setting);
app.use("/api/admin",admin);

// const redisHost = process.env.REDIS_HOST || 'localhost';
// const redisPort = process.env.REDIS_PORT || 6379;

// const client = redis.createClient({
//   url: `redis://${redisHost}:${redisPort}`
// });

// client.connect();

// app.get('/', async (req, res) => {
//   await client.set('hello', 'world');
//   const value = await client.get('hello');
//   res.send(`Redis says: ${value}`);
// });

// Node.js example
// const Redis = require("ioredis");
// const redis = new Redis(); // connects to localhost:6379

// redis.info("server").then(console.log);

app.listen(port, ()=> {
    console.log(`server in running on ${port}`);
    db()
});
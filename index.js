const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorHandler.middleware");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

// Routers
const authRouter = require("./routes/auth.routes");
const carRouter = require("./routes/car.routes");
const categoryRouter = require("./routes/category.routes");

const app = express();

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));


connectDB();

const swaggerDocument = YAML.load("./docs/swagger.yaml");
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/cars", carRouter);
app.use("/api/categories", categoryRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

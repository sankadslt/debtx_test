/* 
        Purpose: This template is used for the main server page.
        Created Date: 2024-11-21
        Created By: Janendra Chamodi (apjanendra@gmail.com)
        Last Modified Date: 2024-12-7
        Modified By: Janendra Chamodi (apjanendra@gmail.com)
                    Lasandi Randini (randini-im20057@stu.kln.ac.lk)
        Version: Node.js v20.11.1
        Dependencies: cors , dotenv , express
        Related Files: DRC_route.js,swaggerOptions.js
        Notes: This template uses Node. 
*/




import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import { swaggerSpec } from "./swaggerOptions.js";
import DRC_serviceRouter from "./routes/DRC_Service_route.js";
import rtomRouter from "./routes/RTOM_route.js";
import drcRouter from "./routes/DRC_route.js";
import RORoutes from "./routes/RO_route.js";
import serviceRouter from "./routes/Service_route.js";
import sequenceRouter from "./routes/Sequence_route.js";

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/DRC", drcRouter);
app.use("/api/service", serviceRouter);
app.use("/api/DRC_service", DRC_serviceRouter);
app.use("/api/sequence", sequenceRouter);
app.use("/api/RTOM", rtomRouter);
app.use("/api/recovery_officer", RORoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

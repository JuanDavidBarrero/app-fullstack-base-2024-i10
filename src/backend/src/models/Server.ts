import 'dotenv/config'; // Asegúrate de importar dotenv al principio del archivo
import express, { Application } from 'express';
import cors from 'cors';
import Database from './../database/config';
import deviceRoutes from './../routes/devices';

class Server {
    public app: Application;
    private port: string;
    private db: Database;
    private devicePath: string; 

    constructor() {
        this.app = express();
        this.port = '4000';
        this.devicePath = '/api/device'; 

        this.db = new Database();

        this.conectarDb();

        this.middlewares();

        this.routes();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes() {
        this.app.use(this.devicePath, deviceRoutes); // Usamos las rutas aquí
    }

    async conectarDb() {

        await this.db.connect();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

export default Server;

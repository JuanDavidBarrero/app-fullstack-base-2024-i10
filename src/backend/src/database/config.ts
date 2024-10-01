import { Pool } from 'pg';

class Database {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: process.env.USER || 'postgres',
            password: process.env.PASS || 'password',
            host: process.env.PGHOST || 'localhost',
            port: Number(process.env.PORTDB) || 5432,
            database: process.env.DB || 'mydatabase',
        });
    }

    async connect(): Promise<void> {
        try {
            await this.pool.connect();
            console.log('Conexión a PostgreSQL establecida');
        } catch (error) {
            console.error('Error al conectar a la base de datos', error);
            throw new Error('Error al conectar a la base de datos');
        }
    }


    getPool(): Pool {
        return this.pool;
    }


    async close(): Promise<void> {
        try {
            await this.pool.end();
            console.log('Conexión a PostgreSQL cerrada');
        } catch (error) {
            console.error('Error al cerrar la conexión a la base de datos', error);
            throw new Error('Error al cerrar la conexión a la base de datos');
        }
    }
}

export default Database;


//docker run --name myDatabase -e POSTGRES_PASSWORD=hades -e POSTGRES_DB=fullstack -p 5432:5432 -d postgres:15.3


// CREATE TABLE devices (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     description TEXT,
//     isCardSwitch BOOLEAN NOT NULL DEFAULT FALSE
// );


// SELECT * FROM devices;

// SELECT current_database();


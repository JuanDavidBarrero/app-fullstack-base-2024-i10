import { Request, Response } from 'express';
import Database from '../database/config';

const db = new Database();


const devicesGet = async (req: Request, res: Response) => {
    try {
        const query = 'SELECT * FROM devices'; 
        const result = await db.getPool().query(query); 
        
        res.json(result.rows); 
    } catch (error) {
        console.error('Error al obtener dispositivos:', error);
        res.status(500).json({ message: 'Error al obtener dispositivos' });
    }
};


const addDevices = async (req: any, res: any) => {
    const { name, description, iscardswitch } = req.body;

    
    if (!name ) {
        return res.status(400).json({ message: 'Faltan campos requeridos o isCardSwitch no es válido' });
    }

    
    const query = `
        INSERT INTO devices (name, description, iscardswitch)
        VALUES ($1, $2, $3)
        RETURNING id
    `;

    const values = [name, description || null, iscardswitch];

    try {
        
        const result = await db.getPool().query(query, values);
        const newDeviceId = result.rows[0].id;

        
        res.status(201).json({ message: 'Dispositivo agregado', id: newDeviceId });
    } catch (error) {
        console.error('Error al agregar dispositivo:', error);
        res.status(500).json({ message: 'Error al agregar dispositivo' });
    }
};



const deleteDevice = async (req: any, res: any) => {
    const { id } = req.params; 

    if (!id) {
        return res.status(400).json({ message: 'Falta el ID del dispositivo' });
    }

    const query = 'DELETE FROM devices WHERE id = $1 RETURNING id'; 

    try {
        const result = await db.getPool().query(query, [id]); 

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Dispositivo no encontrado' }); 
        }

        res.json({ message: 'Dispositivo eliminado', id: result.rows[0].id }); 
    } catch (error) {
        console.error('Error al eliminar dispositivo:', error);
        res.status(500).json({ message: 'Error al eliminar dispositivo' }); 
    }
};

export { devicesGet, addDevices , deleteDevice};


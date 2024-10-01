import { Router } from 'express';
import { devicesGet, addDevices, deleteDevice, handleDataDevice } from '../controllers/devices';

const router = Router();

router.get('/', devicesGet);
router.post('/', addDevices);
router.post('/data', handleDataDevice);
router.delete('/:id', deleteDevice);

export default router;

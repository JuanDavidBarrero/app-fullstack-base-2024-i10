import { Router } from 'express';
import { devicesGet,addDevices,deleteDevice } from '../controllers/devices'; 

const router = Router();

router.get('/', devicesGet);
router.post('/', addDevices);
router.delete('/:id', deleteDevice); 

export default router;

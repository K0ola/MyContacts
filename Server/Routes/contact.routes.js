const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth');
const ctrl = require('../controllers/contacts.controller');

router.use(requireAuth);

router.post('/', ctrl.createContact);
router.get('/', ctrl.getContacts);
router.get('/:id', ctrl.getContactById);
router.put('/:id', ctrl.updateContact);
router.delete('/:id', ctrl.deleteContact);

module.exports = router;

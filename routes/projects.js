const CmsController =  require('../controller/cms.js');


const router = require('express').Router();

router.get('/', CmsController.index);
router.get('/:id', CmsController.show);
router.post('/', CmsController.create);
router.put('/:id', CmsController.update);
router.delete('/:id', CmsController.delete);


module.exports = router;

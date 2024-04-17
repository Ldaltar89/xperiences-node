const { Router } = require("express");
const multer = require('multer');
const {
  getUserContracts,
  createUserContract,
  getUserContract,
  updateUserContract,
  deleteUserContract,
} = require("../controllers/userContract.controller.js");

const router = Router();
const upload = multer();
const { validarJWT } = require("../middlewares/validar-jwr.js");

router.use(validarJWT);

router.get("/",getUserContracts);
router.post("/",createUserContract);
router.put("/:id",upload.single('contract_signed'),updateUserContract);
router.patch("/:id",deleteUserContract);
router.get("/:id",getUserContract);


module.exports = router;

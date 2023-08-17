import express from "express";

const router = express.Router();

// ACA VAMOS A HACER EL RENDER
router.get("/", (request, response) => {
  response.render("index", {});
});

export default router;

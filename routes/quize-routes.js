const router = require("express").Router()
const {auth} = require("../app/helpers/middleware")
const quizController = require("../app/controllers/quiz-controllers")




router.get("/" , auth , quizController.getQuestions)
router.post("/add-question" , auth , quizController.addQuestion) //admin auth
router.put("/edit-question/:id" , auth , quizController.editQuestion)  //admin auth
router.delete("/delete-question/:id" , auth , quizController.deleteQuestion) //admin auth

router.get("/answer" , auth , quizController.answer)


module.exports = router
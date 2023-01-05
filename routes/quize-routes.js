const router = require("express").Router()
const {auth} = require("../app/helpers/middleware")
const {adminAuth} = require("../app/helpers/middleware")
const quizController = require("../app/controllers/quiz-controllers")




router.get("/" , auth , quizController.getQuestions)
router.post("/add-question" , adminAuth , quizController.addQuestion) 
router.put("/edit-question/:id" , adminAuth , quizController.editQuestion)  
router.delete("/delete-question/:id" , adminAuth , quizController.deleteQuestion) 

router.get("/answer" , auth , quizController.answer)


module.exports = router
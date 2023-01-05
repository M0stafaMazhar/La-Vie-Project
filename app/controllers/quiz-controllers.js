const quizModel = require("../../db/models/quiz-model")
const helper = require("../helpers/helpers")
const mongoose = require("mongoose")



class Quiz{
    static addQuestion = async(req,  res)=>{
        try{
            const quistion = new quizModel(req.body)
            await quistion.save()
            helper.resHandler(res , 200 , true , quistion , "quistion added successfully")
        }
        catch(err){
            helper.resHandler(res , 500 , false , err , err.message)
        }
    }

    static getQuestions = async (req,res)=>{
        try{
            const questions = await quizModel.find({level: req.user.level})
            helper.resHandler(res, 200, true, questions, `${req.user.level} questions`)
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static editQuestion = async (req,res) => {
        try{
            const quistion = await quizModel.findById(req.params.id);
            if(!quistion) throw new Error("could not find quistion")
            Object.assign(quistion , req.body)
            await quistion.save()
            helper.resHandler(res, 200, true, quistion, "quistion edited successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static deleteQuestion = async (req,res) => {
        try{
            await quizModel.findByIdAndDelete(req.params.id);
            helper.resHandler(res, 200, true, {} ,"question deleted successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static answer = async(req , res)=>{
        try{
            const correctAns = req.body.answers.filter(a => a.status == true) 
            
            const quistions = await quizModel.find({"_id":{ $in: correctAns.map(a => a = mongoose.Types.ObjectId(a._id))}})

            const score = quistions.reduce((accumulator, object) => {
                return accumulator + object.points;
              }, 0);
            
            req.user.points += score
            await req.user.save()

            helper.resHandler(res, 200, true, {quizResult : score}, "results recieved successfully")

        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

}




module.exports = Quiz
const router = require('express').Router()
const blogController = require('../app/controllers/blogs-controllers')
const {auth} = require('../app/helpers/middleware')


router.post('/add-blog', auth , blogController.addBlog)

router.get('/show-blog/:id' , blogController.showBlog) 

router.get("/all-blogs" , blogController.allBlogs)

router.put("/edit-blog/:id" , auth , blogController.edit)

router.delete("/delete-blog/:id" , auth , blogController.deleteBlog)

router.post("/add-review/:id" , auth , blogController.addReview)

router.delete("/delete-review/:blogId/:reviewId" , auth , blogController.deleteReview)

router.get("/show-reviews/:id" , blogController.showReviews)

router.put("/edit-review/:blogId/:reviewId" , auth , blogController.editReview)

router.post("/bookmark/:id" , auth ,blogController.bookMark)









module.exports = router
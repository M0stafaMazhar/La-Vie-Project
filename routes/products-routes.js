const router = require('express').Router()
const productController = require('../app/controllers/products-controllers')
const {auth} = require('../app/helpers/middleware')
const {partnerAuth} = require('../app/helpers/middleware')


router.get('/', productController.allProducts)
router.post('/add-product', partnerAuth , productController.addProduct)
router.get('/show-product/:id' , productController.showProduct)
router.put("/edit-product/:id", partnerAuth , productController.updateProduct)
router.delete("/delete-product/:id", partnerAuth , productController.deleteProduct)

router.post("/add-review/:id" , auth , productController.addReview)

router.get("/show-reviews/:id" , productController.showReviews)

router.delete("/delete-review/:productId/:reviewId" , auth , productController.deleteReview)

router.put("/edit-review/:productId/:reviewId" , auth , productController.editReview)

router.post("/bookmark/:id" , auth ,productController.bookMark)

router.post("/add-to-cart/:id" , auth ,productController.addToCart)

router.delete("/remove-from-cart/:id" , auth ,productController.removeFromCart)


//filter 
module.exports = router
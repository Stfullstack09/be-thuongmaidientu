const express = require('express');
const ProductController = require('../controllers/ProductController');
const { CreateNewProduct } = require('../controllers/ProductController');
const SiteController = require('../controllers/SiteController');
const UserController = require('../controllers/UserController');
const VerifyToken = require('../services/VerifyToken');

const router = express.Router();

const appRouter = (app) => {
    router.get('/listaddress', SiteController.GetListAddress);
    router.get('/listgender', SiteController.GetListGender);
    router.get('/get-one-uer', VerifyToken.VerifyTokenAccess, SiteController.GetOneUser);
    router.post('/product-create-new-product', VerifyToken.VerifyTokenAccessRole, ProductController.CreateNewProduct);
    router.get('/get-detail-product', ProductController.GetProductById);
    router.get('/get-category', SiteController.GetCategory);
    router.get('/get-product-by-type', ProductController.GetProductByType);
    router.get('/get-product-new-and-bestseller', ProductController.GetProductNewAndBestseller);
    router.get('/search-product-jsx', ProductController.SearchProduct);
    router.get(
        '/get-detail-product-by-admin',
        VerifyToken.VerifyTokenAccessRole,
        ProductController.GetDetailProductByAdmin,
    );
    router.get('/get-all-product-by-admin', VerifyToken.VerifyTokenAccessRole, ProductController.GetAllProductByAdmin);
    router.post(
        '/update-product-jsx-by-admin',
        VerifyToken.VerifyTokenAccessRole,
        ProductController.UpdateProductByAdmin,
    );
    router.post(
        `/delete-product-jsx-by-admin`,
        VerifyToken.VerifyTokenAccessRole,
        ProductController.DeleteProductByAdmin,
    );
    router.get(
        '/get-all-product-deleted-by-admin',
        VerifyToken.VerifyTokenAccessRole,
        ProductController.GetAllProductDeletedByAdmin,
    );
    router.post(
        '/restore-product-deleted-by-admin',
        VerifyToken.VerifyTokenAccessRole,
        ProductController.RestoreProductDeletedByAdmin,
    );

    router.get('/get-detail-product-by-customer', ProductController.GetDetailProductByCustomer);
    router.get('/get-all-size-product', ProductController.GetAllSizeProduct);
    router.post('/add-product-to-cart', VerifyToken.VerifyTokenAccess, ProductController.AddProductToCart);
    router.get('/get-all-product-cart', VerifyToken.VerifyTokenAccess, ProductController.GetAllProductToCart);
    router.post('/remove-product-to-cart', VerifyToken.VerifyTokenAccess, ProductController.RemoveProductToCart);
    router.post(
        '/change-count-product-to-cart',
        VerifyToken.VerifyTokenAccess,
        ProductController.ChangeCountProductToCart,
    );
    router.get(
        '/get-information-user-checkout',
        VerifyToken.VerifyTokenAccess,
        ProductController.GetInforMationUserCheckout,
    );

    router.post(
        '/update-status-user-checkout',
        VerifyToken.VerifyTokenAccess,
        ProductController.UpdateStatusUserCheckout,
    );

    router.get('/get-totalMoney-checkout', VerifyToken.VerifyTokenAccess, ProductController.GetTotalMoneyCheckout);
    router.post('/post-data-order', VerifyToken.VerifyTokenAccess, ProductController.PostDataOrder);
    router.get('/get-product-order', VerifyToken.VerifyTokenAccess, ProductController.GetProductOrder);

    router.get('/get-current-user', VerifyToken.VerifyTokenAccess, UserController.GetCurrentUser);

    router.post('/update-user-current', VerifyToken.VerifyTokenAccess, UserController.UpdateCurrentUser);

    app.use('/api/v1/app', router);
};

module.exports = appRouter;

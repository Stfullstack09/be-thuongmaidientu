const ProductServices = require('../services/ProductServices');

class ProductController {
    async CreateNewProduct(req, res) {
        try {
            const data = await ProductServices.CreateNewProduct(req.body);

            return res.status(200).json(data);
        } catch (error) {
            res.status(200).json(data);
        }
    }

    async GetProductById(req, res) {
        try {
            const data = await ProductServices.GetProductById(req.query.id);

            return res.status(200).json(data);
        } catch (error) {
            res.status(200).json(data);
        }
    }

    async GetProductByType(req, res) {
        try {
            const data = await ProductServices.GetProductByType(req.query.type);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async GetProductNewAndBestseller(req, res) {
        try {
            const data = await ProductServices.GetProductNewAndBestseller(req.query.limit);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errorCode: -1,
                msg: 'error from server',
            });
        }
    }

    async SearchProduct(req, res) {
        try {
            const data = await ProductServices.SearchProduct(req.query.q);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async GetDetailProductByAdmin(req, res) {
        try {
            const data = await ProductServices.GetDetailProductByAdmin(req.query.id, req.body.email);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async GetAllProductByAdmin(req, res) {
        try {
            const data = await ProductServices.GetAllProductByAdmin(req.body.email);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async UpdateProductByAdmin(req, res) {
        try {
            const data = await ProductServices.UpdateProductByAdmin(req.body);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async DeleteProductByAdmin(req, res) {
        try {
            const data = await ProductServices.DeleteProductByAdmin(req.body.id, req.body.email);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async GetAllProductDeletedByAdmin(req, res) {
        try {
            const data = await ProductServices.GetAllProductDeletedByAdmin(req.body.email);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async RestoreProductDeletedByAdmin(req, res) {
        try {
            const data = await ProductServices.RestoreProductDeletedByAdmin(req.body.email, req.body.id);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async GetDetailProductByCustomer(req, res) {
        try {
            const data = await ProductServices.GetDetailProductByCustomer(req.query.id);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async GetAllSizeProduct(req, res) {
        try {
            const data = await ProductServices.GetAllSizeProduct();

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async AddProductToCart(req, res) {
        try {
            const data = await ProductServices.AddProductToCart(req.body);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async GetAllProductToCart(req, res) {
        try {
            const data = await ProductServices.GetAllProductToCart(req.query.userId);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async RemoveProductToCart(req, res) {
        try {
            const data = await ProductServices.RemoveProductToCart(req.query.id, req.query.userId);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async ChangeCountProductToCart(req, res) {
        try {
            const data = await ProductServices.ChangeCountProductToCart(req.query.type, req.query.id, req.body);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async GetInforMationUserCheckout(req, res) {
        try {
            const data = await ProductServices.GetInforMationUserCheckout(req.body.email);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async GetTotalMoneyCheckout(req, res) {
        try {
            const data = await ProductServices.GetTotalMoneyCheckout(req.body.email);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async UpdateStatusUserCheckout(req, res) {
        try {
            const data = await ProductServices.UpdateStatusUserCheckout(req.body.email);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async PostDataOrder(req, res) {
        try {
            const data = await ProductServices.PostDataOrder(req.body);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async GetProductOrder(req, res) {
        try {
            const data = await ProductServices.GetProductOrder(req.body.email);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }
}

module.exports = new ProductController();

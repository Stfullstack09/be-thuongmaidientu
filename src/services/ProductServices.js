const otpGenerator = require('otp-generator');
const db = require('../models');
const Sequelize = require('sequelize');
const ConstantBE = require('../utils/constant');
const handlePriceDisCount = require('../utils/handlePrice');
const Op = Sequelize.Op;
const EmailService = require('./EmailServices');
const { v4: uuidv4 } = require('uuid');
const { generateToken } = require('./AuhServices');

class ProductServices {
    CreateNewProduct(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (
                    !data.email ||
                    !data.thumbnail ||
                    !data.title ||
                    !data.contentHTML ||
                    !data.contentTEXT ||
                    !data.price ||
                    !data.categoryId
                ) {
                    return resolve({
                        errCode: 1,
                        msg: 'Missing required parameters',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email: data.email,
                    },
                    raw: true,
                });

                if (!user) {
                    return resolve({
                        errCode: 10,
                        msg: 'User not found',
                    });
                }

                await db.Product.create({
                    userId: user.id,
                    thumbnail: data.thumbnail,
                    title: data.title,
                    contentHTML: data.contentHTML,
                    contentTEXT: data.contentTEXT,
                    price: data.price,
                    categoryId: data.categoryId,
                    discount: data.disCount ? data.disCount : null,
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetProductById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return resolve({
                        errCode: 1,
                        msg: 'Missing required parameters',
                    });
                }

                let data = await db.Product.findOne({
                    where: {
                        id,
                    },

                    attributes: {
                        exclude: ['deleted'],
                    },
                });

                if (!data) {
                    data = {
                        msg: 'Sản phẩm bạn tìm không nằm trong hệ thống',
                    };
                }

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetProductByType(type) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!type) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameters',
                    });
                }

                const data = await db.Product.findAll({
                    where: {
                        categoryId: type,
                        deleted: null,
                    },
                    attributes: {
                        exclude: ['contentHTML', 'contentTEXT', 'deleted'],
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'categoryData',
                        },
                    ],
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetProductNewAndBestseller(limit) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!limit) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameter',
                    });
                }

                const data = await db.Product.findAll({
                    order: [[Sequelize.literal('RAND()')]],
                    limit: +limit || 5,
                    attributes: {
                        exclude: ['contentHTML', 'contentTEXT', 'deleted'],
                    },
                    where: {
                        deleted: null,
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'categoryData',
                        },
                    ],
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async SearchProduct(q) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!q) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameter',
                    });
                }

                const data = await db.Product.findAll({
                    where: {
                        title: {
                            [Op.like]: `%${q}%`,
                        },
                        deleted: null,
                    },
                    attributes: {
                        exclude: ['contentHTML', 'contentTEXT', 'deleted'],
                    },
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetDetailProductByAdmin(id, email) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id || !email) {
                    return resolve({
                        errCode: 0,
                        msg: 'missing required parameters',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email,
                    },
                    raw: true,
                });

                if (!user) {
                    return resolve({
                        errCode: 2,
                        msg: 'user not found',
                    });
                }

                const data = await db.Product.findOne({
                    where: {
                        id,
                        userId: user.id,
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'categoryData',
                        },
                    ],
                    attributes: {
                        exclude: ['deleted'],
                    },
                });

                if (!data) {
                    return resolve({
                        errCode: 3,
                        msg: 'Product not found',
                    });
                }

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetAllProductByAdmin(email) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!email) {
                    return resolve({
                        errCode: 0,
                        msg: 'missing required parameters',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email,
                    },
                    raw: true,
                });

                if (!user) {
                    return resolve({
                        errCode: 2,
                        msg: 'user not found',
                    });
                }

                const data = await db.Product.findAll({
                    where: {
                        userId: user.id,
                        deleted: null,
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'categoryData',
                        },
                    ],
                    attributes: {
                        exclude: ['deleted'],
                    },
                });

                if (!data) {
                    return resolve({
                        errCode: 3,
                        msg: 'Product not found',
                    });
                }

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async UpdateProductByAdmin(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.email || !data.title || !data.price || !data.contentTEXT || !data.contentHTML) {
                    return resolve({
                        errCode: 0,
                        msg: 'missing required parameters',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email: data.email,
                    },
                    raw: true,
                });

                if (!user) {
                    return resolve({
                        errCode: 2,
                        msg: 'user not found',
                    });
                }

                await db.Product.update(
                    {
                        title: data.title,
                        price: data.price,
                        contentHTML: data.contentHTML,
                        contentTEXT: data.contentTEXT,
                        discount: data.discount,
                        categoryId: data.categoryId,
                    },
                    {
                        where: {
                            userId: user.id,
                            id: data.id,
                        },
                    },
                );

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async DeleteProductByAdmin(id, email) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id || !email) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameters',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email: email,
                    },
                    raw: true,
                });

                if (!user) {
                    return resolve({
                        errCode: 2,
                        msg: 'user not found',
                    });
                }

                await db.Product.update(
                    {
                        deleted: 1,
                    },
                    {
                        where: {
                            id: id,
                            userId: user.id,
                        },
                    },
                );

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetAllProductDeletedByAdmin(email) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!email) {
                    return resolve({
                        errCode: 0,
                        msg: 'missing required parameters',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email,
                    },
                    raw: true,
                });

                if (!user) {
                    return resolve({
                        errCode: 2,
                        msg: 'user not found',
                    });
                }

                const data = await db.Product.findAll({
                    where: {
                        userId: user.id,
                        deleted: 1,
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'categoryData',
                        },
                    ],
                    attributes: {
                        exclude: ['deleted'],
                    },
                });

                if (!data) {
                    return resolve({
                        errCode: 3,
                        msg: 'Product not found',
                    });
                }

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async RestoreProductDeletedByAdmin(email, id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!email || !id) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameters',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email,
                    },
                    raw: true,
                });

                if (!user) {
                    return resolve({
                        errCode: 2,
                        msg: 'user not found',
                    });
                }

                await db.Product.update(
                    {
                        deleted: null,
                    },
                    {
                        where: {
                            id: id,
                            userId: user.id,
                        },
                    },
                );

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetDetailProductByCustomer(id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameters',
                    });
                }

                const data = await db.Product.findOne({
                    where: {
                        id,
                    },
                    attributes: {
                        exclude: ['deleted', 'contentTEXT'],
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'categoryData',
                        },
                    ],
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetAllSizeProduct() {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await db.Allcode.findAll({
                    where: {
                        type: ConstantBE.SIZE,
                    },
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async AddProductToCart(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.productId || !data.userId || !data.count || !data.size) {
                    resolve({
                        errCode: 1,
                        msg: 'missing required parameters',
                    });
                    return;
                }

                const product = await db.Cart.findOne({
                    where: {
                        productId: data.productId,
                        userId: data.userId,
                    },
                });

                if (!product) {
                    await db.Cart.create({
                        productId: data.productId,
                        userId: data.userId,
                        count: data.count,
                        size: data.size,
                    });
                } else {
                    await db.Cart.update(
                        {
                            count: +product.count + +data.count,
                            size: data.size,
                        },
                        {
                            where: {
                                userId: data.userId,
                                productId: data.productId,
                            },
                        },
                    );
                }

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetAllProductToCart(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!userId) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameters',
                    });
                }

                const data = await db.Cart.findAll({
                    where: {
                        userId,
                    },
                    include: [
                        {
                            model: db.Product,
                            as: 'productData',
                            attributes: {
                                exclude: ['contentTEXT', 'contentHTML', 'deleted'],
                            },
                        },
                        {
                            model: db.Allcode,
                            as: 'sizeData',
                        },
                    ],
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async RemoveProductToCart(id, userId) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!userId || !id) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameters',
                    });
                }

                await db.Cart.destroy({
                    where: {
                        userId,
                        productId: id,
                    },
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async ChangeCountProductToCart(type, id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!type || type === 'undefined' || !id) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameters',
                    });
                }

                const Pro = await db.Cart.findOne({
                    where: {
                        id,
                    },
                });

                if (!Pro) {
                    return resolve({
                        errCode: 3,
                        msg: 'product not found',
                    });
                }

                if (type === ConstantBE.type.down) {
                    if (+Pro.count === 1) {
                        return resolve({
                            errCode: 2,
                            msg: 'count product not found === 0',
                        });
                    }

                    await db.Cart.update(
                        {
                            count: +Pro.count - 1,
                        },
                        {
                            where: {
                                id,
                            },
                        },
                    );
                }

                if (type === ConstantBE.type.up) {
                    await db.Cart.update(
                        {
                            count: +Pro.count + 1,
                        },
                        {
                            where: {
                                id,
                            },
                        },
                    );
                }

                if (type === ConstantBE.type.change) {
                    await db.Cart.update(
                        {
                            count: data.count,
                        },
                        {
                            where: {
                                id,
                            },
                        },
                    );
                }

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetInforMationUserCheckout(email) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!email) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameter',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email,
                    },
                    attributes: {
                        exclude: ['password', 'roleId', 'createdAt', 'updatedAt'],
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'addressData',
                        },
                    ],
                });

                if (!user) {
                    return resolve({
                        errCode: 2,
                        msg: 'User not found',
                    });
                }

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data: user,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetTotalMoneyCheckout(email) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!email) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameter',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email,
                    },
                    attributes: {
                        exclude: ['password', 'roleId', 'createdAt', 'updatedAt'],
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'addressData',
                        },
                    ],
                });

                if (!user) {
                    return resolve({
                        errCode: 2,
                        msg: 'User not found',
                    });
                }

                const cart = await db.Cart.findAll({
                    where: {
                        userId: user.id,
                    },
                    include: [
                        {
                            model: db.Product,
                            as: 'productData',
                            attributes: {
                                exclude: ['contentTEXT', 'contentHTML', 'deleted'],
                            },
                        },
                    ],
                });

                let total = 0;

                if (cart && cart.length > 0) {
                    total = cart.reduce((result, item) => {
                        return (
                            result + handlePriceDisCount(item.productData.price, item.productData.discount) * item.count
                        );
                    }, 0);
                }

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data: total,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async UpdateStatusUserCheckout(email) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!email) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameter',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email,
                    },
                    attributes: {
                        exclude: ['password', 'roleId', 'createdAt', 'updatedAt'],
                    },
                });

                if (!user) {
                    return resolve({
                        errCode: 2,
                        msg: 'User not found',
                    });
                }

                await db.Cart.Order(
                    {
                        where: {
                            userId: user.id,
                        },
                    },
                    {
                        statusId: 'S2',
                    },
                );

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async PostDataOrder(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.email || !data.phoneNumber) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameters',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email: data.email,
                    },
                });

                if (!user) {
                    return resolve({
                        errCode: 2,
                        msg: 'User not found',
                    });
                }

                const products = await db.Cart.findAll({
                    where: {
                        userId: user.id,
                    },
                    raw: true,
                });

                if (products && products.length > 0) {
                    products.map(async (item) => {
                        const uuid = await uuidv4();
                        await db.Oder.create({
                            userId: user.id,
                            phoneNumber: data.phoneNumber,
                            note: data.note,
                            address: data.address,
                            productId: item.productId,
                            statusId: 'S1',
                            totalMoney: data.totalMoney,
                            size: item.size,
                            uuid: uuid.toLocaleUpperCase(),
                            count: item.count,
                        });
                    });

                    await db.Cart.destroy({
                        where: {
                            userId: user.id,
                        },
                    });
                }

                return resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetProductOrder(email) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!email) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required email',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email,
                    },
                    raw: true,
                });

                if (!user) {
                    return resolve({
                        errCode: 3,
                        msg: 'User not found',
                    });
                }

                const data = await db.Oder.findAll({
                    where: {
                        userId: user.id,
                    },
                    include: [
                        {
                            model: db.Product,
                            as: 'productDataOder',
                            attributes: {
                                exclude: ['thumbnail', 'contentHTML', 'contentTEXT', 'deleted'],
                            },
                        },
                        {
                            model: db.Allcode,
                            as: 'statusData',
                        },
                    ],
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetProductsOderByCustomer(email) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!email) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required email',
                    });
                }

                const data = await db.Oder.findAll({
                    where: {
                        [Op.or]: [{ statusId: 'S1' }, { statusId: 'S2' }],
                    },
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async UpdateStatusOrderByAdminShop(email, status, id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!email || !id || !status) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameters',
                    });
                }

                await db.Oder.update(
                    {
                        statusId: status,
                    },
                    {
                        where: {
                            id,
                        },
                    },
                );

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async UpdateStatusProductByCustomer(email, id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!email || !id) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameters',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email,
                    },
                });

                if (!user) {
                    return resolve({
                        errCode: 3,
                        msg: 'User not found',
                    });
                }

                const productOder = await db.Oder.findOne({
                    where: {
                        id,
                    },
                    raw: true,
                });

                if (!productOder) {
                    return resolve({
                        errCode: 4,
                        msg: 'product not found',
                    });
                }

                await db.Oder.update(
                    {
                        statusId: 'S4',
                    },
                    {
                        where: {
                            id,
                        },
                    },
                );

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async SalesRegistrationByCustomer(email) {
        let OTP = otpGenerator.generate(6, {
            digits: false,
            upperCaseAlphabets: true,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        return new Promise(async (resolve, reject) => {
            try {
                if (!email) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameter',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email,
                    },
                    raw: true,
                });

                if (!user) {
                    return resolve({
                        errCode: 3,
                        msg: 'user not found',
                    });
                }

                await db.User.update(
                    {
                        uuid: OTP,
                    },
                    {
                        where: {
                            email,
                        },
                    },
                );

                await EmailService.SendEmailSalesRegistrationByCustomer({
                    email,
                    OTP,
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async CheckEmailValidServices(state) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!state.email || !state.OTP) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameters',
                    });
                }

                const user = await db.User.findOne({
                    where: {
                        email: state.email,
                        uuid: state.OTP,
                        roleId: 'R3',
                    },
                    attributes: {
                        exclude: ['password', 'createdAt', 'updatedAt'],
                    },
                    raw: true,
                });

                if (!user) {
                    return resolve({
                        errCode: 3,
                        msg: 'Wrong my OTP',
                    });
                }

                await db.User.update(
                    {
                        roleId: 'R2',
                        uuid: null,
                    },
                    {
                        where: {
                            email: state.email,
                            id: user.id,
                        },
                    },
                );

                const userDoneUpdate = await db.User.findOne({
                    where: {
                        email: state.email,
                    },
                    attributes: {
                        exclude: ['password', 'createdAt', 'updatedAt'],
                    },
                    raw: true,
                });

                const { accessToken, refreshToken } = await generateToken({
                    firstName: userDoneUpdate.firstName,
                    lastName: userDoneUpdate.lastName,
                    email: userDoneUpdate.email,
                    roleId: userDoneUpdate.roleId,
                });

                await db.Token.update(
                    {
                        refToken: refreshToken,
                        accessToken: accessToken,
                    },
                    {
                        where: {
                            userId: userDoneUpdate.id,
                        },
                    },
                );

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    user: {
                        ...userDoneUpdate,
                        accessToken,
                    },
                    accessToken,
                    refreshToken,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetOderProductsByCustomer(id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameter',
                    });
                }

                const order = await db.Oder.findOne({
                    where: {
                        id,
                    },
                    include: [
                        {
                            model: db.Product,
                            as: 'productDataOder',
                            attributes: {
                                exclude: ['contentHTML', 'contentTEXT', 'deleted'],
                            },
                        },
                        {
                            model: db.Allcode,
                            as: 'statusData',
                        },
                        {
                            model: db.Allcode,
                            as: 'SizeOderData',
                        },
                        {
                            model: db.User,
                            as: 'userData',
                            attributes: {
                                exclude: [
                                    'password',
                                    'avatar',
                                    'uuid',
                                    'roleId',
                                    'createdAt',
                                    'updatedAt',
                                    'gender',
                                    'address',
                                ],
                            },
                        },
                    ],
                });

                if (!order) {
                    return resolve({
                        errCode: 3,
                        msg: 'order not found',
                    });
                }

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data: order,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async RestoreProductOrderByCustomer(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.email || !data.id) {
                    return resolve({
                        errCode: 1,
                        msg: 'missing required parameters',
                    });
                }

                await db.Oder.update(
                    {
                        statusId: 'S1',
                    },
                    {
                        where: {
                            id: data.id,
                        },
                    },
                );

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new ProductServices();

const db = require('../models');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

class PostServices {
    async CreateNewPost(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (
                    !data.email ||
                    !data.thumbnail ||
                    !data.title ||
                    !data.contentHTML ||
                    !data.contentTEXT ||
                    !data.time
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
                        errCode: 3,
                        msg: 'User not found',
                    });
                }

                await db.Post.create({
                    userId: user.id,
                    title: data.title,
                    thumbnail: data.thumbnail,
                    contentHTML: data.contentHTML,
                    contentTEXT: data.contentTEXT,
                    time: data.time,
                    deleted: null,
                    isPublic: 1,
                    countLike: 0,
                    countCMT: 0,
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

    async UpdateEditPost(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.id || !data.title || !data.contentHTML || !data.contentTEXT || !data.time) {
                    return resolve({
                        errCode: 1,
                        msg: 'Missing required parameters',
                    });
                }

                await db.Post.update(
                    {
                        title: data.title,
                        contentHTML: data.contentHTML,
                        contentTEXT: data.contentTEXT,
                        time: data.time,
                        deleted: null,
                        isPublic: 1,
                    },
                    {
                        id: data.id,
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

    async DeletedPost(email, id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!email || !id) {
                    return resolve({
                        errCode: 1,
                        msg: 'Missing required parameters',
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

                await db.Post.update(
                    {
                        deleted: 1,
                    },
                    {
                        userId: user.id,
                        id: data.id,
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

    async GetDetailPost(id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return resolve({
                        errCode: 1,
                        msg: 'Missing required parameter',
                    });
                }

                const data = await db.Post.findOne({
                    where: {
                        id,
                    },
                    attributes: {
                        exclude: ['deleted', 'contentTEXT'],
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'userDataPost',
                            attributes: {
                                exclude: ['password', 'roleId', 'createdAt', 'updatedAt', 'uuid'],
                            },
                        },
                    ],
                    raw: false,
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

    async GetAllPosts(limit) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!limit) {
                    limit = 5;
                }

                const data = await db.Post.findAll(
                    {
                        order: [[Sequelize.literal('RAND()')]],
                        limit: +limit,
                        attributes: {
                            exclude: ['isPublic', 'deleted'],
                        },
                    },
                    {
                        where: {
                            isPublic: 1,
                            deleted: null,
                        },
                    },
                );

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

    async GetPostRelated(id, limit) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id || !limit) {
                    limit = 3;
                }

                const data = await db.Post.findAll({
                    order: [[Sequelize.literal('RAND()')]],
                    attributes: ['id', 'title', 'thumbnail'],
                    limit: +limit,
                    where: {
                        id: {
                            [Op.ne]: id,
                        },
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
}

module.exports = new PostServices();

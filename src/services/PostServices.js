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
                if (
                    !data.email ||
                    !data.id ||
                    !data.title ||
                    !data.contentHTML ||
                    !data.contentTEXT ||
                    !data.time ||
                    !data.thumbnail
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
                        msg: 'user not found',
                    });
                }

                await db.Post.update(
                    {
                        thumbnail: data.thumbnail,
                        title: data.title,
                        contentHTML: data.contentHTML,
                        contentTEXT: data.contentTEXT,
                        time: data.time,
                    },
                    {
                        where: {
                            id: data.id,
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

                const post = await db.Post.findOne({
                    where: {
                        id,
                        isPublic: 1,
                    },
                });

                if (!post) {
                    return resolve({
                        errCode: 4,
                        msg: 'There is no access to this resource or the resource does not exist!',
                    });
                }

                await db.Post.update(
                    {
                        countLike: post.countLike + 1,
                    },
                    {
                        where: {
                            id,
                        },
                    },
                );

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
                        where: {
                            isPublic: 1,
                        },
                    },
                    {
                        order: [[Sequelize.literal('RAND()')]],
                        limit: +limit,
                        attributes: {
                            exclude: ['isPublic'],
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

    async GetAllPostManage(email, limit, page) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!email || !limit || !page) {
                    return resolve({
                        errCode: 1,
                        msg: 'Missing required parameters',
                    });
                }

                const offset = (page - 1) * limit;
                let isValidNextPage = true;
                let countQuery = page * limit;

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

                const post = await db.Post.findAll({
                    where: {
                        userId: user.id,
                    },
                    offset,
                    limit: +limit,
                    attributes: {
                        exclude: ['thumbnail', 'countCMT', 'contentHTML', 'contentTEXT', 'createdAt', 'updatedAt'],
                    },
                });

                if (post && post.length === 0) {
                    return resolve({
                        errCode: 4,
                        msg: 'No records found',
                    });
                }

                const count = await db.Post.count({
                    where: {
                        userId: user.id,
                    },
                });

                if (+countQuery >= +count) {
                    isValidNextPage = false;
                }

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data: post,
                    TotalRecords: count,
                    isValidNextPage,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async UpdateStatusPost(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.email | !data.id || !data.status) {
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

                await db.Post.update(
                    {
                        isPublic: data.status,
                    },
                    {
                        where: {
                            id: data.id,
                            userId: user.id,
                        },
                    },
                );

                const post = await db.Post.findOne({
                    where: {
                        id: data.id,
                        userId: user.id,
                    },
                    attributes: {
                        exclude: ['thumbnail', 'countCMT', 'contentHTML', 'contentTEXT', 'createdAt', 'updatedAt'],
                    },
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    post,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetDetailPostEditById(email, id) {
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
                        msg: 'user not found',
                    });
                }

                const post = await db.Post.findOne({
                    where: {
                        id,
                        userId: user.id,
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                });

                if (!post) {
                    return resolve({
                        errCode: 4,
                        msg: 'There is no access to this resource or the resource does not exist!',
                    });
                }

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data: post,
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new PostServices();

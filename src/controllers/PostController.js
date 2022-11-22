const PostServices = require('../services/PostServices');

class PostController {
    async GetDetailPost(req, res) {
        try {
            const data = await PostServices.GetDetailPost(req.query.id);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async CreateNewPost(req, res) {
        try {
            const data = await PostServices.CreateNewPost(req.body);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async UpdateEditPost(req, res) {
        try {
            const data = await PostServices.UpdateEditPost(req.body);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async DeletedPost(req, res) {
        try {
            const data = await PostServices.DeletedPost(req.body.email, req.params.id);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async GetAllPosts(req, res) {
        try {
            const data = await PostServices.GetAllPosts(req.query.limit);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async GetPostRelated(req, res) {
        try {
            const data = await PostServices.GetPostRelated(req.query.id, req.query.limit);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async GetAllPostManage(req, res) {
        try {
            const data = await PostServices.GetAllPostManage(req.body.email, req.query.limit, req.query.page);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async UpdateStatusPost(req, res) {
        try {
            const data = await PostServices.UpdateStatusPost(req.body);

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'error from server',
            });
        }
    }

    async GetDetailPostEditById(req, res) {
        try {
            const data = await PostServices.GetDetailPostEditById(req.body.email, req.query.id);

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

module.exports = new PostController();

import { RequestHandler } from "express";

export default interface IArticlesController {
    getAllEndpoint: RequestHandler;
    /**
     * @apiVersion 1.0.0
     * @api {get} /articles/:id Get article by Id
     * @apiGroup Articles
     * @apiName GetArticleById
     * @apiParam {String} id="646efb881d54394b5616d4eb" Unique article Id
     * @apiPermission None
     * @apiSampleRequest /articles/
     * @apiSuccess {Object} data 
     * @apiSuccessExample {json} Success Respsonse Example:
     *   HTTP/1.1 20
     *   {
     *       "success": true,
     *       "data": {
     *          "_id": "64b7009e1cf3d0c5577384c8",
     *          "title": "artilce 1",
     *          "type": "reference",
     *          "description": "asdf",
     *          "content": "asdf",
     *          "createdAt": 1689714779521,
     *          "creators": [],
     *          "reactions": [
     *              {
     *                  "_id": "64b70777f16a2112ec22553b",
     *                  "type": "dislike",
     *                  "user": "6471f42bcc6434f22606f859",
     *                  "article": "64b7009e1cf3d0c5577384c8",
     *                  "reactedAt": 1689716522337,
     *                  "__v": 0
     *              }
     *          ],
     *          "feedbacks": [],
     *          "__v": 0
     *       },
     *       "errors": []
     *   }
     * @apiError IdNotValid Id: '{id}' is not valid
     * @apiError ArticleNotFound Article with Id: '{id}' is not found
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 400 BadRequest
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "IdNotValid Id: '239AAdsfasdf123' is not valid"
     *          }
     *       ]
     *   }
     */
    getByIdEndpoint: RequestHandler,

    getPopulareEndpoint: RequestHandler;

    /**
     * @apiVersion 1.0.0
     * @api {put} /articles/:id Update article
     * @apiGroup Articles
     * @apiName UpdateArticle
     * @apiParam {String} id="646efb881d54394b5616d4eb" Unique article Id
     * @apiBody {String{5..40}} title="JavaScript Math cos()" 
     * @apiBody {String{..60}} description="Returns the cosine of an angle"
     * @apiBody {String} content="..."
     * @apiPermission Administrator
     * @apiSampleRequest /articles/
     * @apiSuccessExample {json} Success Respsonse Example:
     *   HTTP/1.1 204 NoContent
     * @apiError TokenRequired JWT token is required!
     * @apiError InvalidToken JWT token is not valid
     * @apiError Unauthorized You don't have privilege to make this action
     * @apiError IdNotValid Id: '{id}' is not valid
     * @apiError RequiredFields One of the following fields is required 'title', 'description' and 'content'
     * @apiError ArticleNotFound Article with Id: '{id}' is not found
     * @apiError DatabaseValidation Database errors
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 400 BadRequest
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "One of the following fields is required 'title', 'description' and 'content'"
     *          }
     *       ]
     *   }
     */
    updateEndpoint: RequestHandler,

    /**
     * @apiVersion 1.0.0
     * @api {delete} /articles/:id Remove article
     * @apiGroup Articles
     * @apiName RemoveArticle
     * @apiParam {String} id="646efb881d54394b5616d4eb" Unique article Id
     * @apiPermission Administrator
     * @apiSampleRequest /articles/
     * @apiSuccessExample {json} Success Respsonse Example:
     *   HTTP/1.1 204 NoContent
     * @apiError TokenRequired JWT token is required!
     * @apiError InvalidToken JWT token is not valid
     * @apiError Unauthorized You don't have privilege to make this action
     * @apiError IdNotValid Id: '{id}' is not valid
     * @apiError ArticleNotFound Article with Id: '{id}' is not found
     * @apiError DatabaseValidation Database errors
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 401 Unauthorized
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "You don't have privilege to make this action"
     *          }
     *       ]
     *   }
     */
    removeEndpoint: RequestHandler,

    /**
     * @apiVersion 1.0.0
     * @api {post} /react/articles/:id React to article
     * @apiGroup Articles
     * @apiName ReactToArticle
     * @apiParam {String} id="646efb881d54394b5616d4eb" Unique article Id
     * @apiQuery {String="like","dislike"} type="like" Reaction type
     * @apiPermission Normal User
     * @apiSampleRequest /react/articles/
     * @apiSuccessExample {json} Success Respsonse Example:
     *   HTTP/1.1 204 NoContent
     * @apiError TokenRequired JWT token is required!
     * @apiError InvalidToken JWT token is not valid
     * @apiError IdNotValid Id: '{id}' is not valid
     * @apiError TypeValidation The 'type' query parameter should be either 'like' or 'dislike'
     * @apiError ArticleNotFound Article with Id: '{id}' is not found
     * @apiError DatabaseValidation Database errors
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 400 BadRequest
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "The 'type' query parameter should be either 'like' or 'dislike'"
     *          }
     *       ]
     *   }
     */
    reactToEndpoint: RequestHandler,

    /**
     * @apiVersion 1.0.0
     * @api {delete} /react/articles/:id Unreact to article
     * @apiGroup Articles
     * @apiName UnreactToArticle
     * @apiParam {String} id="646efb881d54394b5616d4eb" Unique article Id
     * @apiPermission Normal User
     * @apiSampleRequest /react/articles/
     * @apiSuccessExample {json} Success Respsonse Example:
     *   HTTP/1.1 204 NoContent
     * @apiError TokenRequired JWT token is required!
     * @apiError InvalidToken JWT token is not valid
     * @apiError IdNotValid Id: '{id}' is not valid
     * @apiError ArticleNotFound Article with Id: '{id}' is not found
     * @apiError ReactNotFound You didn't react to this article
     * @apiError DatabaseValidation Database errors
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 400 BadRequest
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "You didn't react to this article"
     *          }
     *       ]
     *   }
     */
    unReactToEndpoint: RequestHandler,
    
    /**
     * @apiVersion 1.0.0
     * @api {get} /feedbacks Get all feedbacks
     * @apiGroup Feedbacks
     * @apiName GetAllFeedbacks
     * @apiPermission Administrator
     * @apiSuccess {Object} data List of feedbacks
     * @apiSampleRequest /feedbacks
     * @apiSuccessExample {json} Success Respsonse Example:
     *   HTTP/1.1 20
     *   {
     *       "success": true,
     *       "data": [
     *          {
     *              "_id": "646ef1becce26a7fe229ce02",
     *              "user": "6468bb31aff1731dac1346ab",
     *              "article": "646b6f57461b00f7df688b19",
     *              "text": "...",
     *              "createdAt": 1684992443785,
     *              "__v": 0
     *          },
     *          ...
     *       ],
     *       "errors": []
     *   }
     * @apiError TokenRequired JWT token is required!
     * @apiError InvalidToken JWT token is not valid
     * @apiError Unauthorized You don't have privilege to make this action
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 400 BadRequest
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "JWT token is not valid"
     *          }
     *       ]
     *   }
     */
    getFeedbacksEndpoint: RequestHandler,

    /**
     * @apiVersion 1.0.0
     * @api {post} /articles/:id/send-feedback Send feedback about an article
     * @apiGroup Feedbacks
     * @apiName SendFeedback
     * @apiParam {String} id="646efb881d54394b5616d4eb" Unique article Id
     * @apiBody {String} text="..." The feedback
     * @apiPermission Normal User
     * @apiSampleRequest /articles/646efb881d54394b5616d4eb/send-feedback
     * @apiSuccess (Created 201) {Object} data Sended feedback
     * @apiSuccessExample {json} Success Respsonse Example:
     *   HTTP/1.1 201 Created
     *   {
     *       "success": true,
     *       "data": {
     *          "_id": "646ef1becce26a7fe229ce02",
     *          "user": "6468bb31aff1731dac1346ab",
     *          "article": "646b6f57461b00f7df688b19",
     *          "text": "...",
     *          "createdAt": 1684992443785,
     *          "__v": 0
     *       },
     *       "errors": []
     *   }
     * @apiError TokenRequired JWT token is required!
     * @apiError InvalidToken JWT token is not valid
     * @apiError IdNotValid Id: '{id}' is not valid
     * @apiError ArticleNotFound Article with Id: '{id}' is not found
     * @apiError RequiredFields The 'text' field is required
     * @apiError DatabaseValidation Database errors
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 400 BadRequest
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "The 'text' field is required"
     *          }
     *       ]
     *   }
     */
    sendFeedbackEndpoint: RequestHandler,

    /**
     * @apiVersion 1.0.0
     * @api {delete} /feedbacks/:id Remove a feedback
     * @apiGroup Feedbacks
     * @apiName RemoveFeedback
     * @apiParam {String} id="646efb881d54394b5616d4eb" Unique feedback Id
     * @apiPermission Administrator
     * @apiSampleRequest /feedbacks/
     * @apiSuccessExample {json} Success Respsonse Example:
     *   HTTP/1.1 204 NoContent
     * @apiError TokenRequired JWT token is required!
     * @apiError InvalidToken JWT token is not valid
     * @apiError Unauthorized You don't have privilege to make this action
     * @apiError IdNotValid Id: '{id}' is not valid
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 400 BadRequest
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "JWT token is not valid"
     *          }
     *       ]
     *   }
     */
    removeFeedbackEndpoint: RequestHandler
}
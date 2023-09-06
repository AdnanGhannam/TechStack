import { RequestHandler } from "express";

export default interface IUsersController {
    /**
     * @apiVersion 1.0.0
     * @api {post} /login/ User login 
     * @apiGroup Users
     * @apiName Login
     * @apiPermission None
     * @apiBody {String{4..20}} name="adnan" Username
     * @apiBody {String} password="Adnan@1234567890" user's password
     * @apiSampleRequest /login/
     * @apiSuccess {Object} data Token and Privilege
     * @apiSuccessExample {json} Success Respsonse Example:
     *   HTTP/1.1 200 OK
     *   {
     *       "success": true,
     *       "data": {
     *           "token": "XVCJ9.LOljV4pma8te.pLOljV4pma8tef2I",
     *           "privilege": "administrator"
     *       },
     *       "errors": []
     *   }
     * @apiError RequiredFields The 'name' and 'password' fields are required
     * @apiError UserNotFound User with name: '{name}' is not found
     * @apiError WrongPassword Password is wrong
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 404 NotFound
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "User with name: 'adnan1' is not found"
     *          }
     *       ]
     *   }
     */
    loginEndpoint: RequestHandler,
    
    /**
     * @apiVersion 1.0.0
     * @api {post} /register/ User registration 
     * @apiGroup Users
     * @apiName Register
     * @apiPermission None
     * @apiBody {String{4..20}} name="adnan" Username
     * @apiBody {String} email="adnan@gmail.com" Email (user@examle.abc)
     * @apiBody {String} password="Adnan@1234567890" New account's password
     * @apiSampleRequest /register/
     * @apiSuccess (Created 201) {Object} data Created user information
     * @apiSuccessExample {json} Success Response Example:
     *   HTTP/1.1 201 Created
     *   {
     *       "success": true,
     *       "data": {
     *          "name": "adnan",
     *          "email": "adnan@gmail.com",
     *          "privilege": "user",
     *          "joinedAt": 1689880943244,
     *          "userCollection": "64b989bee1f9c98dd8dc3b04",
     *          "_id": "64b989bee1f9c98dd8dc3b07",
     *          "__v": 0
     *       },
     *       "errors": []
     *   }
     * @apiError RequiredFields The 'name', 'email' and 'password' fields are required
     * @apiError PasswordConstraints Password should contain at least: 1 uppercase letters, 1 lowercase letters, 1 numbers, 1 special characters.
     * @apiError ShortPassword Password is too short (min length is 10)
     * @apiError DatabaseValidation Database errors
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 404 NotFound
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "Password is too short (min length is 10)"
     *          }
     *       ]
     *   }
     */
    registerEndpoint: RequestHandler,

    getEndpoint: RequestHandler,

    /**
     * @apiVersion 1.0.0
     * @api {get} /users/:id Get user by id
     * @apiGroup Users
     * @apiName GetUserById
     * @apiParam {String} id="646efb881d54394b5616d4eb" Unique user Id
     * @apiPermission None
     * @apiSampleRequest /users/
     * @apiSuccess {Object} data User with the given Id
     * @apiSuccessExample {json} Success Response Example:
     *   HTTP/1.1 200 Ok
     *   {
     *       "success": true,
     *       "data": {
     *          "name": "adnan",
     *          "email": "adnan@gmail.com",
     *          "privilege": "user",
     *          "joinedAt": 1689880943244,
     *          "userCollection": "64b989bee1f9c98dd8dc3b04",
     *          "_id": "64b989bee1f9c98dd8dc3b07",
     *          "__v": 0
     *       },
     *       "errors": []
     *   }
     * @apiError IdNotValid Id: '{id}' is not valid
     * @apiError UserNotFound User with id: '{id}' is not found
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 400 BadRequest
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "Id: '64b989be3b07' is not valid"
     *          }
     *       ]
     *   }
     */
    getByIdEndpoint: RequestHandler,

    /**
     * @apiVersion 1.0.0
     * @api {put} /user Update personal account
     * @apiGroup Users
     * @apiName UpdateUser
     * @apiPermission Normal User
     * @apiSuccessExample {json} Success Response Example:
     *   HTTP/1.1 204 NoContent
     * @apiError TokenRequired JWT token is required!
     * @apiError InvalidToken JWT token is not valid
     * @apiError UserNotFound User with id: '{id}' is not found
     * @apiError RequiredFields One of the following fields is required: 'name' and 'email'
     * @apiError DatabaseValidation Database errors
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 400 BadRequest
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "One of the following fields is required: 'name' and 'email'"
     *          }
     *       ]
     *   }
     */
    updateEndpoint: RequestHandler,

    /**
     * @apiVersion 1.0.0
     * @api {delete} /user Remove personal account
     * @apiGroup Users
     * @apiName RemoveUser
     * @apiPermission Normal User
     * @apiSuccessExample {json} Success Response Example:
     *   HTTP/1.1 204 NoContent
     * @apiError TokenRequired JWT token is required!
     * @apiError InvalidToken JWT token is not valid
     * @apiError DatabaseValidation Database errors
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 403 Forbidden
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "JWT token is required!"
     *          }
     *       ]
     *   }
     */
    removeEndpoint: RequestHandler,

    updateByIdEndpoint: RequestHandler,

    removeByIdEndpoint: RequestHandler,

    /**
     * @apiVersion 1.0.0
     * @api {get} /collection Get personal collection
     * @apiGroup Collections
     * @apiName GetCollection
     * @apiPermission Normal User
     * @apiSuccess {Object} data User's Collection
     * @apiSuccessExample {json} Success Response Example:
     *   HTTP/1.1 200 Ok
     *   {
     *       "success": true,
     *       "data": {
     *         "_id": "6471f42bcc6434f22606f856",
     *          "articles": [...],
     *          "lastModifyAt": 1685189505141,
     *          "__v": 2
     *       },
     *       "errors": []
     *   }
     * @apiError TokenRequired JWT token is required!
     * @apiError InvalidToken JWT token is not valid
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 403 Forbidden
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "JWT token is required!"
     *          }
     *       ]
     *   }
     */
    getCollectionEndpoint: RequestHandler,

    /**
     * @apiVersion 1.0.0
     * @api {post} /collection/:id Add article to personal collection
     * @apiGroup Collections
     * @apiName AddArticleToCollection
     * @apiParam {String} id="646efb881d54394b5616d4eb" Article Id
     * @apiPermission Normal User
     * @apiSampleRequest /collection/
     * @apiSuccessExample {json} Success Response Example:
     *   HTTP/1.1 204 NoContent
     * @apiError TokenRequired JWT token is required!
     * @apiError InvalidToken JWT token is not valid
     * @apiError IdNotValid Id: '{id}' is not valid
     * @apiError ArticleNotFound Article with Id: '{id}' is not found
     * @apiError AlreadyExists You already have this aritcle in your collection
     * @apiError LimitReached You've reached you limit
     * @apiError DatabaseValidation Database errors
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 400 BadRequest
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "You've reached you limit"
     *          }
     *       ]
     *   }
     */
    addToCollectionEndpoint: RequestHandler,

    /**
     * @apiVersion 1.0.0
     * @api {delete} /collection/:id Remove article from personal collection
     * @apiGroup Collections
     * @apiName RemoveArticleFromCollection
     * @apiParam {String} id="646efb881d54394b5616d4eb" Article Id
     * @apiPermission Normal User
     * @apiSampleRequest /collection/
     * @apiSuccessExample {json} Success Response Example:
     *   HTTP/1.1 204 NoContent
     * @apiError TokenRequired JWT token is required!
     * @apiError InvalidToken JWT token is not valid
     * @apiError IdNotValid Id: '{id}' is not valid
     * @apiError ArticleNotFound Article with Id: '{id}' is not found
     * @apiError DatabaseValidation Database errors
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 40
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "Article with Id: '64b7009e1cf3d0c5577384c8' is not found"
     *          }
     *       ]
     *   }
     */
    removeFromCollectionEndpoint: RequestHandler
};
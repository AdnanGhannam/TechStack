import { RequestHandler } from "express";

export default interface ISectionsController {
    /**
     * @apiVersion 1.0.0
     * @api {post} /sections/ Create a new section
     * @apiGroup Sections
     * @apiName CreateSection
     * @apiPermission Administrator
     * @apiBody {String{5..40}} title="JavaScript Math Object" Section title
     * @apiBody {String="reference","tutorial"} type="reference" Section type
     * @apiBody {Object} article Section first article
     * @apiBody {String{5..40}} artilce.title="JavaScript Math sin()" Article title
     * @apiBody {String{..60}} artilce.description="Returns the sine of an angle" Article description
     * @apiBody {String} artilce.content="..." Article content
     * @apiSampleRequest /sections/
     * @apiSuccess (Created 201) {Object} data Created section
     * @apiSuccessExample {json} Success Respsonse Example:
     *   HTTP/1.1 201 Created
     *   {
     *       "success": true,
     *       "data": {
     *          "title": "section1",
     *          "type": "reference",
     *          "createdAt": 1689951986119,
     *          "creator": "6471f42bcc6434f22606f859",
     *          "articles": [
     *              "64ba9ef5b9f210d352711fb5"
     *          ],
     *          "_id": "64ba9ef5b9f210d352711fb6",
     *          "__v": 0
     *       },
     *       "errors": []
     *   }
     * @apiError TokenRequired JWT token is required!
     * @apiError InvalidToken JWT token is not valid
     * @apiError Unauthorized You don't have privilege to make this action
     * @apiError RequiredFields The following fields are required: 'title', 'type', 'article.title', 'article.description' and 'article.content'
     * @apiError DatabaseValidation Database errors
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 400 BadRequest
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "Path `title` (`article 1`) is already used"
     *          }
     *       ]
     *   }
     */
    // createEndpoint: RequestHandler,

    /**
     * @apiVersion 1.0.0
    * @api {get} /sections/ Get all sections by type
    * @apiGroup Sections
    * @apiName GetAllSections
    * @apiQuery {String="reference","tutorial"} type Section type
    * @apiPermission None
    * @apiSampleRequest /sections
    * @apiSuccess {Object} data Sections
    * @apiSuccessExample {json} Success Respsonse Example:
    *   HTTP/1.1 200 Ok
    *   {
    *       "success": true,
    *       "data": [
    *          {
    *              "_id": "646b00cd5e3498d8a8ea34b0",
    *              "title": "JavaScript Math Object",
    *              "type": "reference",
    *              "createdAt": 1684734148213,
    *              "creator": "6468bb31aff1731dac1346ab",
    *              "articles": [],
    *              "__v": 0
    *          },
    *          ...
    *       ],
    *       "errors": []
    *   }
    * @apiError TypeValidation The 'type' query parameter should be either 'reference' or 'tutorial'
    * @apiErrorExample {json} Error Response Example:
    *   HTTP/1.1 400 BadRequest
    *   {
    *       "success": false,
    *       "data": null,
    *       "errors": [
    *          {
    *              "message": "The 'type' query parameter should be either 'reference' or 'tutorial'"
    *          }
    *       ]
    *   }
    */
    getAllEndpoint: RequestHandler,

    /**
     * @apiVersion 1.0.0
     * @api {get} /sections/:id Get section by Id
     * @apiGroup Sections
     * @apiName GetSectionById
     * @apiParam {String} id="646efb881d54394b5616d4eb" Unique section id
     * @apiPermission None
     * @apiSampleRequest /sections/
     * @apiSuccess {Object} data Section
     * @apiSuccessExample {json} Success Respsonse Example:
     *   HTTP/1.1 200 Ok
     *   {
     *       "success": true,
     *       "data": {
     *          "_id": "646b00cd5e3498d8a8ea34b0",
     *          "title": "JavaScript Math Object",
     *          "type": "reference",
     *          "createdAt": 1684734148213,
     *          "creator": "6468bb31aff1731dac1346ab",
     *          "articles": [],
     *          "__v": 0
     *       },
     *       "errors": []
     *   }
     * @apiError IdNotValid Id: '{id}' is not valid
     * @apiError SectionNotFound Section with Id: '{id}' is not found
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 404 NotFound
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "Section with Id: '6468bb31aff1731dac3346ab' is not found"
     *          }
     *       ]
     *   }
     */
    getByIdEndpoint: RequestHandler,

    /**
     * @apiVersion 1.0.0
     * @api {put} /sections/:id Update section
     * @apiGroup Sections
     * @apiName UpdateSection
     * @apiParam {String} id="646efb881d54394b5616d4eb" Unique section id
     * @apiBody {String{5..40}} title="New title..." New Title
     * @apiBody {String="reference","tutorial"} type="reference" New type
     * @apiPermission Administrator
     * @apiSampleRequest /sections/
     * @apiSuccessExample {json} Success Respsonse Example:
     *   HTTP/1.1 204 NoContent
     * @apiError TokenRequired JWT token is required!
     * @apiError InvalidToken JWT token is not valid
     * @apiError Unauthorized You don't have privilege to make this action
     * @apiError IdNotValid Id: '{id}' is not valid
     * @apiError SectionNotFound Section with Id: '{id}' is not found
     * @apiError DatabaseValidation Database errors
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 404 NotFound
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "Section with Id: '6468bb31aff1731dac3346ab' is not found"
     *          }
     *       ]
     *   }
     */
    updateEndpoint: RequestHandler,

    /**
     * @apiVersion 1.0.0
     * @api {delete} /sections/:id Remove Section
     * @apiGroup Sections
     * @apiName RemoveSection
     * @apiParam {String} id="646efb881d54394b5616d4eb" Unique section id
     * @apiPermission Administrator
     * @apiSampleRequest /sections/
     * @apiSuccessExample {json} Success Respsonse Example:
     *   HTTP/1.1 204 NoContent
     * @apiError TokenRequired JWT token is required!
     * @apiError InvalidToken JWT token is not valid
     * @apiError Unauthorized You don't have privilege to make this action
     * @apiError IdNotValid Id: '{id}' is not valid
     * @apiError SectionNotFound Section with Id: '{id}' is not found
     * @apiError DatabaseValidation Database errors
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 404 NotFound
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "Section with Id: '6468bb31aff1731dac3346ab' is not found"
     *          }
     *       ]
     *   }
     */
    removeEndpoint: RequestHandler,

    /**
     * @apiVersion 1.0.0
     * @api {post} /sections/article/:id Add new article under a section
     * @apiGroup Sections
     * @apiName AddArticleToSection
     * @apiParam {String} id="646efb881d54394b5616d4eb" Unique section id
     * @apiBody {String{5..40}} title="JavaScript Math cos()" 
     * @apiBody {String{..60}} description="Returns the cosine of an angle"
     * @apiBody {String} content="..."
     * @apiPermission Administrator
     * @apiSampleRequest /sections/article/
     * @apiSuccess (Created 201) {Object} data Created article
     * @apiSuccessExample {json} Success Respsonse Example:
     *   HTTP/1.1 201 Created
     *   {
     *       "success": true,
     *       "data": {
     *          "title": "article 2",
     *          "type": "reference",
     *          "description": "...",
     *          "content": "...",
     *          "createdAt": 1689952947895,
     *          "creators": [
     *              "6471f42bcc6434f22606f859"
     *          ],
     *          "reactions": [],
     *          "feedbacks": [],
     *          "_id": "64baa31c60c1cf0522d5c0ee",
     *          "lastUpdateFrom": "6471f42bcc6434f22606f859",
     *          "__v": 0
     *       },
     *       "errors": []
     *   }
     * @apiError TokenRequired JWT token is required!
     * @apiError InvalidToken JWT token is not valid
     * @apiError Unauthorized You don't have privilege to make this action
     * @apiError IdNotValid Id: '{id}' is not valid
     * @apiError SectionNotFound Section with Id: '{id}' is not found
     * @apiError DatabaseValidation Database errors
     * @apiErrorExample {json} Error Response Example:
     *   HTTP/1.1 400 BadRequest
     *   {
     *       "success": false,
     *       "data": null,
     *       "errors": [
     *          {
     *              "message": "Path `title` (`abc`) is shorter than the minimum allowed length (5)."
     *          }
     *       ]
     *   }
     */
    addToEndpoint: RequestHandler
}
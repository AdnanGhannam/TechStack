"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLECTION_MODEL = void 0;
const mongoose_1 = require("mongoose");
const Article_model_1 = require("./Article.model");
exports.COLLECTION_MODEL = "Collection";
class CollectionModel {
    static get schema() {
        return new mongoose_1.Schema({
            articles: [{
                    type: mongoose_1.Types.ObjectId,
                    ref: Article_model_1.ARTICLE_MODEL
                }],
            lastModifyAt: {
                type: Number,
                immutable: true,
                default: Date.now
            }
        });
    }
    static create() {
        const schema = this.schema;
        return (0, mongoose_1.model)(exports.COLLECTION_MODEL, schema);
    }
}
exports.default = CollectionModel;

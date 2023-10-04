import { Document, InferSchemaType, Schema, Types, model } from "mongoose";
import { ARTICLE_MODEL } from "./Article.model";

export const COLLECTION_MODEL = "Collection";
export type TCollection = InferSchemaType<typeof CollectionModel.schema>;
export type CollectionDocument = Document<unknown, {}, TCollection> & TCollection;

export default class CollectionModel {
    static get schema() {
        return new Schema({
            articles: [{
                type: Types.ObjectId,
                ref: ARTICLE_MODEL
            }],
            lastModifyAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            }
        });
    }

    static create() {
        const schema = this.schema;
        return model<CollectionDocument>(COLLECTION_MODEL, schema);
    }
}
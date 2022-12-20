import { Relation } from '@directus/shared/types';
type RelationInfo = {
    relation: Relation | null;
    relationType: string | null;
};
export declare function getRelationInfo(relations: Relation[], collection: string, field: string): RelationInfo;
export {};

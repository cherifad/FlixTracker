import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { Accountability } from '@directus/shared/types';
declare const processError: (accountability: Accountability | null, error: Readonly<GraphQLError>) => GraphQLFormattedError;
export default processError;

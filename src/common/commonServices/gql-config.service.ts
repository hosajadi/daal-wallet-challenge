import { GraphqlConfig } from '../configs/config.interface';
import { ConfigService } from '@nestjs/config';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private configService: ConfigService) {}
  createGqlOptions(): ApolloDriverConfig {
    const graphqlConfig = this.configService.get<GraphqlConfig>('graphql');
    return {
      autoSchemaFile: graphqlConfig.schemaDestination,
      sortSchema: graphqlConfig.sortSchema,
      buildSchemaOptions: { numberScalarMode: 'integer' },
      csrfPrevention: false,
      installSubscriptionHandlers: true,
      includeStacktraceInErrorResponses: false,
      playground: graphqlConfig.playgroundEnabled,
      context: ({ req }) => ({ req }),
      formatError: (error) => {
        return error;
      },
    };
  }
}

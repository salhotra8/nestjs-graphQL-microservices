import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksResolver } from './books.resolver';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { Book, BookSchema } from './schema/book.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'shared/database.module';
import { UsersResolver } from './users.resolver';
import { CachingModule } from 'shared/caching.module';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import {
  GraphQLDirective,
  DirectiveLocation,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLBoolean,
} from 'graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'cacheControl',
            locations: [
              DirectiveLocation.FIELD_DEFINITION,
              DirectiveLocation.OBJECT,
              DirectiveLocation.INTERFACE,
              DirectiveLocation.UNION,
            ],
            args: {
              maxAge: { type: GraphQLInt },
              scope: {
                type: new GraphQLEnumType({
                  name: 'CacheControlScope',
                  values: {
                    PUBLIC: { value: 'PUBLIC' },
                    PRIVATE: { value: 'PRIVATE' },
                  },
                }),
              },
              inheritMaxAge: { type: GraphQLBoolean },
            },
          }),
        ],
      },
      // 2. Ensure the plugin is loaded to actually process the directive at runtime
      plugins: [
        ApolloServerPluginCacheControl(), // Optional: set default global maxAge
      ],
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    CachingModule,
  ],
  providers: [BooksResolver, BooksService, UsersResolver],
})
export class BooksModule {}

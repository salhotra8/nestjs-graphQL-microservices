import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { DatabaseModule } from 'shared/database.module';
import { User, UserSchema } from '../schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
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
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CachingModule,
  ],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}

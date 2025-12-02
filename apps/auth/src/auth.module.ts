import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'apps/users/schema/user.schema';
import {
  DirectiveLocation,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLBoolean,
  GraphQLDirective,
} from 'graphql';
import { CachingModule } from 'shared/caching.module';
import { DatabaseModule } from 'shared/database.module';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [AuthResolver, AuthService],
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
    ClientsModule.register([
      {
        name: 'AUTH_KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'auth-producer-group',
          },
        },
      },
    ]),
    // 2. JWT Setup
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY', // change this later to get it from .env file
      signOptions: { expiresIn: '1d' },
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CachingModule,
  ],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from 'shared/database.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { CachingModule } from 'shared/caching.module';
import authContext from './auth.context';

@Module({
  imports: [
    CachingModule,
    DatabaseModule,
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        context: authContext,
      },
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'books', url: 'http://localhost:3000/graphql' },
            { name: 'users', url: 'http://localhost:3001/graphql' },
            { name: 'auth', url: 'http://localhost:3002/graphql' },
          ],
        }),
        buildService({ url }) {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }) {
              // Forward the Authorization header
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              const authHeader = context.req?.headers?.['authorization'];
              if (authHeader) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                request.http?.headers.set('authorization', authHeader);
              }
            },
          });
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

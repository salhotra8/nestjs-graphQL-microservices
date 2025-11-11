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

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  providers: [BooksResolver, BooksService],
})
export class BooksModule {}

import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { userData } from '../data';
import { UserEntity } from 'src/user/model/user.entity';

export default class CreateUser implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<any> {
    await dataSource.getRepository(UserEntity).insert(userData);
  }
}

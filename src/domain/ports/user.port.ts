import { User, CreateUser, UpdateUser } from '../entities/user.entity'

export interface UserRepositoryPort {
  findAll(): Promise<User[]>
  findById(id: User['id']): Promise<User | undefined>
  findByEmail(email: User['email']): Promise<User | undefined>
  findByEmail(email: User['email']): Promise<User | undefined>
  create(payload: CreateUser): Promise<User>
  update(id: User['id'], payload: UpdateUser): Promise<User | undefined>
  delete(id: User['id']): Promise<User | undefined>
}

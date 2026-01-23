import type { FastifyRequest } from 'fastify'
import type { User } from '@/application/entities/user.entity'
import { AppErrorPermissions, AppErrorUnauthorized } from '@/application/exceptions'

export const createPermissionMiddleware = () => (roles: User['role'][]) => async (request: FastifyRequest) => {
  if (!request.user) {
    throw new AppErrorUnauthorized('Пользователь не авторизован')
  }
  if (!roles.includes(request.user.role)) {
    throw new AppErrorPermissions('Доступ запрещён')
  }
}

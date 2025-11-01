import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/common/types/auth.types';

/**
 * Base guard con métodos comunes para todos los guards.
 */
export abstract class BaseGuard implements CanActivate {
  abstract canActivate(context: ExecutionContext): boolean | Promise<boolean>;

  /**
   * Extrae el ID del proyecto desde params o body.
   */
  protected getProjectId(request: AuthenticatedRequest): number {
    const projectId =
      request.params.projectId ||
      (request.body as Record<string, unknown>).projectId;

    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    return Number(projectId);
  }

  /**
   * Extrae el ID del usuario desde params o body.
   */
  protected getUserId(request: AuthenticatedRequest): number {
    const userId =
      request.params.userId || (request.body as Record<string, unknown>).userId;

    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return Number(userId);
  }

  /**
   * Método genérico para extraer IDs por nombre de parámetro.
   */
  protected getId(request: AuthenticatedRequest, paramName: string): number {
    const id =
      request.params[paramName] ||
      (request.body as Record<string, unknown>)[paramName];

    if (!id) {
      throw new BadRequestException(`${paramName} is required`);
    }

    return Number(id);
  }
}

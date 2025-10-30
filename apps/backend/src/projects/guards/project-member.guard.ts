import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersprojectsService } from '../../usersprojects/usersprojects.service';
import { AuthenticatedRequest } from '../../common/types/auth.types';
import { BaseGuard } from '../../common/guards/base.guard';

/**
 * Guard that allows access only to users who are members of a project.
 */
@Injectable()
export class ProjectMemberGuard extends BaseGuard {
  constructor(
    private readonly userProjectsService: UsersprojectsService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  /**
   * Checks if the current user belongs to the requested project.
   * @throws {ForbiddenException} If the user is not a member of the project.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user; //Token
    const projectId = this.getProjectId(request);

    try {
      const isMember = await this.userProjectsService.findByUserAndProject(
        user.userid,
        projectId,
      );
      return !!isMember;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new ForbiddenException('You are not a part of this project');
      }
      throw error;
    }
  }
}

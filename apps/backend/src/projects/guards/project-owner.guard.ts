import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from '../../usersprojects/enums/user-role.enum';
import { UsersprojectsService } from '../../usersprojects/usersprojects.service';
import { AuthenticatedRequest } from '../../common/types/auth.types';
import { BaseGuard } from '../../common/guards/base.guard';

/**
 * Guard that allows access only to the project OWNER.
 */
@Injectable()
export class ProjectOwnerGuard extends BaseGuard {
  constructor(private readonly userProjectsService: UsersprojectsService) {
    super();
  }

  /**
   * Checks if the user is the owner of the requested project.
   * @throws {ForbiddenException} If the user is not the project owner or not part of the project.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user; //Token
    const projectId = this.getProjectId(request);

    const userProject = await this.userProjectsService.findByUserAndProject(
      user.userid,
      projectId,
    );

    if (!userProject) {
      throw new ForbiddenException('You are not part of this project');
    }

    if (userProject.role === UserRole.OWNER) return true;

    throw new ForbiddenException(
      'You are not allowed to perform this action on this project',
    );
  }
}

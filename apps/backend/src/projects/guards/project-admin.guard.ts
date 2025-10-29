import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from '../../usersprojects/enums/user-role.enum';
import { UsersprojectsService } from '../../usersprojects/usersprojects.service';

/**
 * Guard that allows access only to project ADMIN or OWNER users.
 */
@Injectable()
export class ProjectAdminGuard implements CanActivate {
  constructor(private readonly userProjectsService: UsersprojectsService) {}

  /**
   * Checks if the user has admin privileges for the requested project.
   * @throws {ForbiddenException} If the user is not part of the project or lacks permissions.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; //Token
    const projectId = Number(request.params.projectId || request.body.projectId );

    const userProject = await this.userProjectsService.findByUserAndProject(
      user.userid,
      projectId,
    );

    if (!userProject) {
      throw new ForbiddenException('You are not part of this project');
    }

    if (userProject.role === UserRole.ADMIN || userProject.role === UserRole.OWNER ) return true;

    throw new ForbiddenException('You are not allowed to perform this action on this project');
  }
}

// projects/projects-scheduler.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, Between, LessThan } from 'typeorm';
import { Project } from './entities/project.entity';
import { projectStatus } from './enums/project-status.enum';

@Injectable()
export class ProjectsSchedulerService {
  private readonly logger = new Logger(ProjectsSchedulerService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  /**
   * Se ejecuta cada hora para actualizar estados automáticamente
   * Puedes cambiar a CronExpression.EVERY_DAY_AT_MIDNIGHT si prefieres una vez al día
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateProjectStatuses() {
    this.logger.log('Actualizando estados de proyectos...');
    
    const now = new Date();
    
    try {
      // 1. PLANNED → ACTIVE (proyectos que ya iniciaron)
      const activatedCount = await this.projectRepository
        .createQueryBuilder()
        .update(Project)
        .set({ status: projectStatus.ACTIVE })
        .where('status = :planned', { planned: projectStatus.PLANNED })
        .andWhere('startDate <= :now', { now })
        .andWhere('endDate >= :now', { now })
        .execute();

      // 2. ACTIVE → COMPLETED (proyectos que ya terminaron)
      const completedCount = await this.projectRepository
        .createQueryBuilder()
        .update(Project)
        .set({ status: projectStatus.COMPLETED })
        .where('status = :active', { active: projectStatus.ACTIVE })
        .andWhere('endDate < :now', { now })
        .execute();

      // 3. PLANNED → COMPLETED (proyectos planeados que ya pasaron su fecha sin activarse)
      const expiredCount = await this.projectRepository
        .createQueryBuilder()
        .update(Project)
        .set({ status: projectStatus.COMPLETED })
        .where('status = :planned', { planned: projectStatus.PLANNED })
        .andWhere('endDate < :now', { now })
        .execute();

      this.logger.log(
        `Estados actualizados: ${activatedCount.affected} activados, ` +
        `${completedCount.affected} completados, ${expiredCount.affected} expirados`,
      );
    } catch (error) {
      this.logger.error('Error actualizando estados de proyectos', error);
    }
  }

  /**
   * Método manual para forzar actualización
   */
  async forceUpdateStatuses() {
    return this.updateProjectStatuses();
  }
}

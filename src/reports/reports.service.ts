import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './reports.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportsRepository: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.reportsRepository.create(reportDto);
    report.user = user;
    return this.reportsRepository.save(report);
  }

  async getEstimate({ make, model, lat, lng, mileage, year }: GetEstimateDto) {
    const response = await this.reportsRepository
      .createQueryBuilder()
      .select('AVG(p)', 'price')
      .addFrom((qb) => {
        return qb
          .select('price as p, mileage')
          .from(Report, 'report')
          .where('make = :make', { make })
          .andWhere('model = :model', { model })
          .andWhere('year - :year BETWEEN -3 AND 3', { year })
          .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
          .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
          .andWhere('approved IS TRUE')
          .orderBy('ABS(mileage - :mileage)', 'DESC')
          .setParameter('mileage', mileage)
          .limit(3);
      }, 'report')
      .getRawOne();

    if (response) {
      response.price = parseFloat(response?.price).toFixed(2);
    }

    return response;
  }

  findOne(id: string) {
    if (!id) {
      return null;
    }
    const report = this.reportsRepository.findOne({ where: { id } });
    return report;
  }

  async remove(id: string) {
    const report = await this.findOne(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return this.reportsRepository.remove(report);
  }

  async approve(id: string, approved: boolean) {
    const report = await this.findOne(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = approved;
    return await this.reportsRepository.save(report);
  }
}

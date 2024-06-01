import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) {
      throw new UnauthorizedException('User not authenticated');
    }
    if (!request.currentUser.isAdmin) {
      throw new UnauthorizedException('User not an admin');
    }
    return true;
  }
}

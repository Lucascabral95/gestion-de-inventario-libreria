import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export const GetUser = createParamDecorator(( data, ctx: ExecutionContext ) => {
   
     const contexto = ctx.switchToHttp().getRequest();
     const reqUser = contexto.user;

     if (reqUser.is_active === false) {
        throw new UnauthorizedException('User is inactive, talk with an admin');
     }

     if (reqUser.role === 'admin') {
        return reqUser;
     }

     if ( reqUser.role !== data ) {
        throw new UnauthorizedException('Only the users with the role of ' + data + ' can access this route');
     }

    return 'Acceso autorizado';
});

import '@fastify/jwt'

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: {
            sub: string,
            user: string,
            avatarUrl: string,
        }
    }
}
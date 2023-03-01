import { FastifyInstance } from "fastify"
import ShortUniqueId from "short-unique-id"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function poolRoutes(fastify: FastifyInstance) {
    fastify.get('/pools/count', async () => {
        const count = await prisma.pool.count()

        return { count }
    })

    fastify.post('/pools', async (request, reply) => {
        const createPoolBody = z.object({
            title: z.string(),
        })

        const { title } = createPoolBody.parse(request.body)

        const generate = new ShortUniqueId({ length: 6 })

        const code = String(generate()).toUpperCase()

        try{
            await request.jwtVerify()
            await prisma.pool.create({
                data: {
                    title: title,
                    code: code,
                    ownerId: request.user.sub,

                    participants: {
                        create: {
                            userId: request.user.sub
                        }
                    }
                }
            })
        } catch {
            await prisma.pool.create({
                data: {
                    title: title,
                    code: code
                }
            })
        }
        return reply.status(201).send({ code })
    })

    fastify.post('/pools/join', {onRequest: [authenticate]}, async (request,reply) => {
        const joinPoolBody = z.object({
            code: z.string(),
        })

        const { code } = joinPoolBody.parse(request.body)

        const pool = await prisma.pool.findUnique({
            where: {
                code: code
            },
            include: {
                participants: { 
                    where:{
                        userId: request.user.sub
                    }
                }
            }
        })

        if(!pool){
            return reply.status(400).send({
                message: 'Poll not found.'
            })
        }

        if(pool.participants.length > 0){
            return reply.status(400).send({
                message: 'You already join this poll.'
            })
        }

        if(!pool.ownerId){
            await prisma.pool.update({
                where: {
                    id: pool.id,
                },
                data: {
                    ownerId: request.user.sub
                }
            })
        }

        await prisma.participant.create({
            data: {
                poolId: pool.id,
                userId: request.user.sub
            }
        })

        return reply.status(201).send()
    })

    fastify.get('/pools',{onRequest: [authenticate]}, async(request,reply) => {
        const pools = await prisma.pool.findMany({
            where: {
               participants: {
                 some:{
                    userId: request.user.sub
                 }
               }
            },
            include:{
                _count: {
                    select: {
                        participants: true
                    }
                },
                owner: {
                    select: {
                        name: true,
                        id: true,
                    }
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true
                            }
                        }
                    },
                    take: 4
                }
            }
        })

        return { pools  }
    })

    fastify.get('/pools/:id',{onRequest: [authenticate]}, async(request,reply) => {
        const getPoolParams = z.object({
            id: z.string(),
        })

        const { id } = getPoolParams.parse(request.params)

        const pool = await prisma.pool.findUnique({
            where: {
               id,
            },
            include:{
                _count: {
                    select: {
                        participants: true,
                    },
                },
                owner: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true,
                            }
                        },
                    },
                    take: 4
                }
            }
        })
        

        return {pool}
    })
}
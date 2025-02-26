// import { PrismaClient } from '@prisma/client'

// const prismaClientSingleton = () =>{
//     return new PrismaClient()
// }

// type PrismaClientSingleton = ReturnType <typeof  prismaClientSingleton>

// const globalForPrisma =  globalThis as unknown as {
//      prisma: PrismaClientSingleton | undefined
// }

// const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// export default prisma


// if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma


import { PrismaClient } from '@prisma/client'

// Create a function to return a new Prisma Client instance
const prismaClientSingleton = () => {
    return new PrismaClient()
}

// Type for the return value of the prismaClientSingleton function
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

// Global object for storing the Prisma Client instance in development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

// If Prisma instance exists in the global object, use it; otherwise, create a new instance
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// Store the Prisma instance in the global object for reuse during development
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
}

export default prisma;
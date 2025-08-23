import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../services/auth';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';

export async function authRoutes(fastify: FastifyInstance) {
  // Register endpoint
  fastify.post<{ Body: RegisterRequest }>('/api/auth/register', async (request, reply) => {
    const prisma = new PrismaClient();
    try {
      const { email, password } = request.body;

      // Basic validation
      if (!email || !password) {
        return reply.status(400).send({
          success: false,
          error: 'Email and password are required'
        } as AuthResponse);
      }

      if (password.length < 6) {
        return reply.status(400).send({
          success: false,
          error: 'Password must be at least 6 characters long'
        } as AuthResponse);
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return reply.status(409).send({
          success: false,
          error: 'User with this email already exists'
        } as AuthResponse);
      }

      // Hash password and create user
      const hashedPassword = await AuthService.hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword
        }
      });

      // Generate JWT token
      const token = AuthService.generateToken({
        userId: user.id,
        email: user.email
      });

      return reply.status(201).send({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email
        }
      } as AuthResponse);

    } catch (error) {
      fastify.log.error(`Registration error: ${error instanceof Error ? error.message : String(error)}`);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      } as AuthResponse);
    } finally {
      await prisma.$disconnect();
    }
  });

  // Login endpoint
  fastify.post<{ Body: LoginRequest }>('/api/auth/login', async (request, reply) => {
    const prisma = new PrismaClient();
    try {
      const { email, password } = request.body;

      // Basic validation
      if (!email || !password) {
        return reply.status(400).send({
          success: false,
          error: 'Email and password are required'
        } as AuthResponse);
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return reply.status(401).send({
          success: false,
          error: 'Invalid email or password'
        } as AuthResponse);
      }

      // Verify password
      const isValidPassword = await AuthService.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return reply.status(401).send({
          success: false,
          error: 'Invalid email or password'
        } as AuthResponse);
      }

      // Generate JWT token
      const token = AuthService.generateToken({
        userId: user.id,
        email: user.email
      });

      return reply.status(200).send({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email
        }
      } as AuthResponse);

    } catch (error) {
      fastify.log.error(`Login error: ${error instanceof Error ? error.message : String(error)}`);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      } as AuthResponse);
    } finally {
      await prisma.$disconnect();
    }
  });

  // Get user profile (protected route example)
  fastify.get('/api/auth/profile', async (request, reply) => {
    const prisma = new PrismaClient();
    try {
      const authHeader = request.headers.authorization;
      const token = AuthService.extractTokenFromHeader(authHeader);

      if (!token) {
        return reply.status(401).send({
          success: false,
          error: 'Authorization token required'
        });
      }

      const payload = AuthService.verifyToken(token);
      if (!payload) {
        return reply.status(401).send({
          success: false,
          error: 'Invalid or expired token'
        });
      }

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, createdAt: true }
      });

      if (!user) {
        return reply.status(404).send({
          success: false,
          error: 'User not found'
        });
      }

      return reply.status(200).send({
        success: true,
        user
      });

    } catch (error) {
      fastify.log.error(`Profile error: ${error instanceof Error ? error.message : String(error)}`);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      });
    } finally {
      await prisma.$disconnect();
    }
  });
}

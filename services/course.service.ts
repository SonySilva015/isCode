import { db } from '@/db';
import { courses, modules } from '@/db/schemas';
import { eq } from 'drizzle-orm';

/**
 * 🔹 Buscar todos os cursos guardados localmente
 */
export const getLocalCourses = async (): Promise<any[]> => {
    try {
        const result = await db.select().from(courses);
        return result;
    } catch (error) {
        console.error('Erro ao buscar cursos locais:', error);
        return [];
    }
};


export const getLocalCourseById = async (courseId: number) => {
    try {
        const [course] = await db
            .select()
            .from(courses)
            .where(eq(courses.id, courseId));

        return course ?? null;
    } catch (error) {
        console.error('Erro ao buscar curso local:', error);
        return null;
    }
};

export const getModuleByCourse = async (
    courseId: number
): Promise<any[]> => {
    try {
        const modulesByCourse = await db
            .select()
            .from(modules)
            .where(eq(modules.fk_courses, courseId));

        return modulesByCourse; // SEMPRE array
    } catch (error) {
        console.error('Erro ao buscar módulos do curso:', error);
        return []; // SEMPRE array
    }
};


export const getModuleById = async (moduleId: any) => {
    try {
        const module = await db
            .select()
            .from(modules)
            .where(eq(modules.id, moduleId));

        return module;
    } catch (error) {
        console.error('Erro ao buscar módulo:', error);
        return [];
    }
};


export const updateModuleProgress = async (moduleId: number, progress: number, completedLessons: number) => {
    try {
        await db
            .update(modules)
            .set({
                porcent: progress,
                lessons_completed: completedLessons
            })
            .where(eq(modules.id, moduleId));
    } catch (error) {
        console.error('Erro ao atualizar progresso do módulo:', error);
    }
};
export const updateModuleStatus = async (moduleId: number, status: string) => {
    try {
        await db
            .update(modules)
            .set({
                status: status
            })
            .where(eq(modules.id, moduleId));
    } catch (error) {
        console.error('Erro ao atualizar status do módulo:', error);
    }
};

export const getLessonCount = async (courseId: number) => {
    try {
        const result = await db
            .select({
                lessons_count: modules.lessons_count,
            })
            .from(modules)
            .where(eq(modules.fk_courses, courseId));

        return result;
    } catch (error) {
        console.error('Erro ao buscar progresso do módulo:', error);
        return null;
    }
};

export const updateCourseProgress = async (courseId: number, progress: number) => {
    try {
        await db
            .update(courses)
            .set({ progress: progress })
            .where(eq(courses.id, courseId));
    } catch (error) {
        console.error('Erro ao atualizar progresso do curso:', error);
    }
};

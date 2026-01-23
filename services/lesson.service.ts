import { db } from '@/db';
import { lessons, quiz } from '@/db/schemas';
import { and, eq, sql } from 'drizzle-orm';



export const getLessons = async (moduleId: any): Promise<any[]> => {
    try {
        const Lessons = await db
            .select()
            .from(lessons)
            .where(eq(lessons.fk_module, moduleId));

        return Lessons;

    } catch (error) {
        console.error('Erro ao buscar lições:', error);
        return [];
    }
};



export const getLessonByid = async (id: number) => {
    try {
        const result = await db.select().
            from(lessons)
            .where(eq(lessons.id, id));
        return result;
    } catch (error) {
        console.error('Erro ao buscar lição por id:', error);
        return [];
    }
};

export const getQuizByLesson = async (id: number): Promise<any[]> => {

    try {
        const result = await db.select().
            from(quiz)
            .where(eq(quiz.fk_lesson, id));

        return result;
    } catch (error) {
        console.error('Erro ao buscar quizzes por lição:', error);
        return [];
    }
};

export const getLessonCompleteCount = async (
    moduleId: number
): Promise<number> => {
    try {
        const result = await db
            .select({
                total: sql<number>`COUNT(*)`,
            })
            .from(lessons)
            .where(
                and(
                    eq(lessons.fk_module, moduleId),
                    eq(lessons.status, 'completed')
                )
            );

        return result[0]?.total ?? 0;
    } catch (error) {
        console.error('Erro ao buscar contagem de lições completas:', error);
        return 0;
    }
};


export const updateStatusLesson = async (id: number) => {
    try {
        await db
            .update(lessons)
            .set({ status: 'completed' })
            .where(eq(lessons.id, id));

    } catch (error) {
        console.error('Erro ao actualizar status da lição', error);
        throw error;
    }
}
export const updateStatusNextLesson = async (id: number) => {
    try {
        await db
            .update(lessons)
            .set({ status: 'opened' })
            .where(eq(lessons.id, id));

    } catch (error) {
        console.error('Erro ao actualizar status da lição', error);
        throw error;
    }
}
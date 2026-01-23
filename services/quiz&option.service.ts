import { db } from '@/db';
import { options, quiz } from '@/db/schemas';
import { and, count, eq } from 'drizzle-orm';


export const getQuizByLesson = async (id: number): Promise<any[]> => {

    try {
        const result = await db.select().
            from(quiz)
            .where(eq(quiz.fk_lesson, id));

        return result;
    } catch (error) {
        console.error('Erro ao buscar quizzes :', error);
        return [];
    }
};

export const getOptionsByQuiz = async (id: number): Promise<any[]> => {
    try {
        // Supondo que haja uma tabela 'options' relacionada ao quiz
        const result = await db.select()
            .from(options)
            .where(eq(options.fk_quiz, id)).orderBy(options.content);

        return result;
    } catch (error) {
        console.error('Erro ao buscar opções por quiz:', error);
        return [];
    }
};

export const getCountQuestions = async (lessonId: number) => {
    try {
        const result = await db
            .select({ total: count() })
            .from(quiz)
            .where(
                and(
                    eq(quiz.fk_lesson, lessonId),
                    eq(quiz.type, 'question') // 
                )
            )

        return result[0]?.total ?? 0;
    } catch (error) {
        console.error('Erro ao contar perguntas por lição:', error);
        return 0;
    }
};

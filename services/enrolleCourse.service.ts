import { db } from '@/db';
import {
    courses,
    game,
    gameLevel,
    lessons,
    modules,
    options,
    quiz,
    quizGame,
    users
} from '@/db/schemas';
import { eq } from 'drizzle-orm';

export const enrolledCourses = async (courseId: string) => {
    // Buscar curso e módulos em paralelo
    const [courseRes, praticeRes] = await Promise.all([
        fetch(`https://server-iscode.vercel.app/courses/${courseId}`),
        fetch(`https://server-iscode.vercel.app/game/${courseId}`)
    ]);

    if (!courseRes.ok && !praticeRes.ok) {
        throw new Error('Erro ao buscar curso');
    }

    const course = await courseRes.json();
    const praticeData = await praticeRes.json();

    // A API retorna um array, então pegamos o primeiro elemento
    const pratice = praticeData[0];


    // Buscar usuário
    const [user] = await db.select().from(users).limit(1);

    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    // Regra de acesso correta
    if (user.plan === 'free' && course.type === 'premium') {
        return 'payment_required';
    }

    // Verificar se curso já existe
    const [existingCourse] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, course.id));

    if (existingCourse) {
        return 'already_enrolled';
    }

    try {
        await db.transaction(async (tx) => {
            // Inserir curso principal
            await tx.insert(courses).values({
                id: course.id,
                title: course.title,
                description: course.description,
                type: course.type,
                modules_count: course.modules?.length || 0,
                progress: 0,
            });

            // Inserir módulos e lições
            if (course.modules?.length) {
                for (const module of course.modules) {
                    await tx.insert(modules).values({
                        id: module.id,
                        fk_courses: course.id,
                        title: module.title,
                        description: module.description,
                        status: module.id === 1 ? 'opened' : 'locked',
                        lessons_count: module.lessons?.length || 0,
                        porcent: 0,
                    });

                    if (module.lessons?.length) {
                        for (const lesson of module.lessons) {
                            await tx.insert(lessons).values({
                                id: lesson.id,
                                fk_module: module.id,
                                title: lesson.title,
                                quizzes: lesson.quizzes?.length || 0,
                                conteudo: lesson.conteudo || '',
                                status: lesson.id === 1 ? 'opened' : 'locked',
                            });

                            if (lesson.quizzes?.length) {


                                for (const q of lesson.quizzes) {
                                    await tx.insert(quiz).values({
                                        id: q.id,
                                        content: q.content || '',
                                        type: q.type || 'multiple_choice',
                                        questions: q.question || '',
                                        exemple: q.exemple || '',
                                        tips: q.tips || '',
                                        fk_lesson: lesson.id,
                                    });

                                    if (q.options?.length) {
                                        for (const op of q.options) {
                                            console.log('Inserindo opção:', op.is_correct || op.isCorrect);
                                            await tx.insert(options).values({
                                                id: op.id,
                                                content: op.text || op.content || '',
                                                iscorrect: op.is_correct || op.isCorrect || false,
                                                fk_quiz: q.id,
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Inserir jogo (prática)
            console.log('inserindo game:', pratice.title);
            await tx.insert(game).values({
                id: pratice.id,
                title: pratice.title,
                desc: pratice.description,
                courseId: pratice.courseId
            });

            // Inserir níveis do jogo
            if (pratice.levels?.length) {
                for (const level of pratice.levels) {
                    console.log('inserindo nivel:', level.level, level.status);

                    await tx.insert(gameLevel).values({
                        id: level.id,
                        level: level.level,
                        status: level.status.trim(), // Remove espaços extras
                        gameId: level.gameId,
                    });

                    // Inserir quizzes do nível
                    if (level.quizzes?.length) {
                        for (const quizItem of level.quizzes) {
                            console.log('inserindo quiz game:', quizItem.id, quizItem.question.substring(0, 30) + '...');

                            // CORREÇÃO PRINCIPAL: 'queston' → 'question' e 'lelvelId' → 'levelId'
                            await tx.insert(quizGame).values({
                                id: quizItem.id,
                                question: quizItem.question, // Corrigido: estava 'queston'
                                answer: quizItem.answer,
                                game_fk: quizItem.levelId, // Corrigido: estava 'lelvelId'
                                // Se seu schema espera o ID do gameLevel, use:
                                // game_fk: level.id
                            });
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error('Erro ao inscrever no curso:', error);
        return 'error';
    }

    return 'ok';
};
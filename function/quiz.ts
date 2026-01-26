import { getLessonCount, getModuleById, updateCourseProgress, updateModuleProgress, updateModuleStatus } from '@/services/course.service';
import { getLessonByid, getLessons, updateStatusLesson, updateStatusNextLesson } from '@/services/lesson.service';
import { insertNotify } from '@/services/notify.service';
import { getCurrentXpLevel, SetXp, updateXp, updateXp_and_Level } from '@/services/progress_here.service';



export const handleCompleteLesson = async (
    lessonId: number,
    moduleId: number,
    xp: number
) => {
    const module = await getModuleById(moduleId);
    if (!module) {
        throw new Error('Módulo não encontrado');
    }
    try {
        const Onelesson = await getLessonByid(lessonId)

        if (Onelesson[0].status !== 'completed') {
            const lessonModuleCompleted = (module[0].lessons_completed || 0) + 1;
            await updateStatusLesson(lessonId);
            const lessons = await getLessons(moduleId);
            const completedLessons = lessons.filter(lesson => lesson.status === 'completed').length;
            let prog = ((completedLessons / (module[0].lessons_count || 1)) * 100);
            if (lessons[lessonId]) {
                await updateStatusNextLesson(lessons[lessonId].id);
            }
            await updateModuleProgress(moduleId, prog, (lessonModuleCompleted || 0));
            const moduleLessonCount = await getLessonCount(module[0]?.fk_courses || 0);
            let totalLessons = 0;

            for (const data of (moduleLessonCount || [])) {
                totalLessons += data.lessons_count || 0;
            }


            let progCourse = ((completedLessons / (totalLessons || 1)) * 100);
            let progCourseFixed = parseFloat(progCourse.toFixed(2)); // Converte para número
            await updateCourseProgress(module[0]?.fk_courses || 0, progCourseFixed);
            const xp_old = await getCurrentXpLevel();
            const xp_current = xp_old?.xp || 0;
            if (xp_current === 0) {
                await SetXp(xp);
                await insertNotify('Primeira vez!', `Você ganhou ${xp} pontos de XP por completar sua primeira lição! Continue assim e avance em seus estudos.`);
            } else if (xp_current >= (xp_old?.nextLevel || 100)) {
                updateXp_and_Level(xp_current + xp, (xp_old?.level || 1) + 1, ((xp_old?.nextLevel || 100) + 100));
                await insertNotify('Parabéns!', `Você alcançou o nível ${(xp_old?.level || 1) + 1}! Continue assim e avance em seus estudos.`);

            } else {
                await updateXp(xp_current + xp);
                if ((xp_current + xp) >= (xp_old?.nextLevel || 100) / 2) {
                    await insertNotify('Parabéns!', `Você está perto para o próximo nível! Continue assim e avance em seus estudos.`);
                }
            }
            if ((module[0].lessons_completed || 0) === (module[0].lessons_count || 0)) {
                const module = await getModuleById(moduleId + 1);
                if (module) {
                    await updateModuleStatus(moduleId, 'completed');
                    await updateModuleStatus(moduleId + 1, 'opened');
                    const lessons = await getLessons(module[0].id);
                    if (lessons[0]) {
                        await updateStatusNextLesson(lessons[0].id);
                    }
                }
            }
        } else {
            return;
        }

    }
    catch (error) {
        console.error('Erro ao completar lição:', error);
    }
}
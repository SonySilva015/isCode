import { sql } from 'drizzle-orm';
import {
    integer,
    sqliteTable,
    text,
} from "drizzle-orm/sqlite-core";

// ─────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────

export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    picture: text("picture"),
    plan: text("plan").default("free"),
    age: integer("age"),
    location: text("location").default('Angola'),
    xp: integer('xp').default(0),
    level: text('level').default('amador')
});


// ─────────────────────────────────────────────
// COURSES
// ─────────────────────────────────────────────

export const courses = sqliteTable("courses", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description"),
    type: text("type"),
    modules_count: integer("modules_count").default(0),
    progress: integer("progress").default(0),
});


// ─────────────────────────────────────────────
// MODULES
// ─────────────────────────────────────────────

export const modules = sqliteTable("modules", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    fk_courses: integer("fk_courses").references(() => courses.id),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").default("locked"),
    lessons_completed: integer("lessons_completed").default(0),
    lessons_count: integer("lessons_count").default(0),
    porcent: integer("porcent").default(0),
});


// ─────────────────────────────────────────────
// LESSONS
// ─────────────────────────────────────────────

export const lessons = sqliteTable("lessons", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    fk_module: integer("fk_module").references(() => modules.id),
    title: text("title").notNull(),
    quizzes: integer("quizzes").default(0),
    conteudo: text("conteudo"),
    status: text("status").default("locked"),
});

// ─────────────────────────────────────────────
// QUIZ
// ─────────────────────────────────────────────

export const quiz = sqliteTable("quiz", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("type"),
    content: text("content"),
    questions: text("questions"),
    exemple: text("exemple"),
    tips: text("tips"),
    fk_lesson: integer("fk_lesson").references(() => lessons.id),
});

export const options = sqliteTable("options", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    content: text("content").notNull(),
    iscorrect: integer("iscorrect", { mode: "boolean" }),
    fk_quiz: integer("fk_quiz").references(() => quiz.id),
});


export const xp_levels = sqliteTable("xp_levels", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    level: integer("level").default(1),
    xp: integer("xp").default(0),
    nextLevel: integer("nextLevel").default(100),
});

export const game = sqliteTable('game', {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text('title'),
    desc: text('desc'),
    courseId: integer('courseId').references(() => courses.id),
})

export const gameLevel = sqliteTable('gameLevel', {
    id: integer("id").primaryKey({ autoIncrement: true }),
    level: integer('level'),
    status: text('status'),
    gameId: integer('gameId').references(() => game.id)
})

export const quizGame = sqliteTable('quizgame', {
    id: integer("id").primaryKey({ autoIncrement: true }),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
    game_fk: integer('game_fk').references(() => gameLevel.id)
})

export const notify = sqliteTable('notify', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title'),
    content: text('content'),
    checked: integer('checked', { mode: 'boolean' }).default(false),
    date: text('date').default(sql`CURRENT_TIMESTAMP`),
})
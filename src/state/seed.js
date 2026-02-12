/**
 * Seed data for development and initial state
 */

const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;

export const INBOX_SEED = [
  {
    id: 'inbox-1',
    text: 'Review quarterly goals',
    createdAt: now - oneDay * 2,
  },
  {
    id: 'inbox-2',
    text: 'Follow up on project proposal',
    createdAt: now - oneDay,
  },
  {
    id: 'inbox-3',
    text: 'Schedule team retrospective',
    createdAt: now - 3600000,
  },
];

export const ACTIONS_SEED = [
  {
    id: 'action-1',
    text: 'Draft architecture document',
    done: false,
    createdAt: now - oneDay * 5,
    dueDate: now + oneDay * 3,
    context: 'work',
    energy: 'high',
    notes: 'Need to include security considerations',
  },
  {
    id: 'action-2',
    text: 'Review pull requests',
    done: false,
    createdAt: now - oneDay * 4,
    context: 'work',
    energy: 'medium',
  },
  {
    id: 'action-3',
    text: 'Buy birthday gift',
    done: false,
    createdAt: now - oneDay * 3,
    dueDate: now + oneDay * 7,
    context: 'personal',
    energy: 'low',
  },
  {
    id: 'action-4',
    text: 'Update documentation',
    done: true,
    createdAt: now - oneDay * 6,
    context: 'work',
    energy: 'low',
  },
  {
    id: 'action-5',
    text: 'Call plumber about leak',
    done: false,
    createdAt: now - oneDay * 2,
    dueDate: now + oneDay,
    context: 'home',
    energy: 'medium',
    notes: 'Phone: 555-0123',
  },
];

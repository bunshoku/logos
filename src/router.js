import { Router } from '@lit-labs/router';
import { store } from './state/store.js';
import { setRoute } from './state/actions.js';

/**
 * Router configuration using @lit-labs/router
 * Keeps router and store.ui.route in sync
 */

export function createRouter(host) {
  const router = new Router(host, [
    {
      path: '/',
      render: () => {
        // Default route - redirect to /next
        router.goto('/next');
        return '';
      },
    },
    {
      path: '/next',
      render: () => {
        store.dispatch(setRoute('next-actions'));
        return host.renderPage('next-actions');
      },
    },
    {
      path: '/inbox',
      render: () => {
        store.dispatch(setRoute('inbox'));
        return host.renderPage('inbox');
      },
    },
    {
      path: '/notes',
      render: () => {
        store.dispatch(setRoute('notes'));
        return host.renderPage('notes');
      },
    },
    {
      path: '/review',
      render: () => {
        store.dispatch(setRoute('review'));
        return host.renderPage('review');
      },
    },
    {
      path: '/habits',
      render: () => {
        store.dispatch(setRoute('habits'));
        return host.renderPage('habits');
      },
    },
    {
      path: '/settings',
      render: () => {
        store.dispatch(setRoute('settings'));
        return host.renderPage('settings');
      },
    },
  ]);

  return router;
}

import api from './api';

export interface PaymentStatus {
    plan: string;
    status: string;
    expires_at: string;
}

export const paymentService = {
    subscribe: (plan: string) =>
        api.post('/payments/subscribe', { plan }),

    getStatus: () =>
        api.get<PaymentStatus>('/payments/status'),

    cancel: () =>
        api.post('/payments/cancel'),
};

import api from './api';

export interface PaymentStatus {
    PLAN: string;
    STATUS: string;
    EXPIRES_AT: string;
}

export const paymentService = {
    subscribe: (plan: string) =>
        api.post('/payments/subscribe', { plan }),

    getStatus: () =>
        api.get<PaymentStatus>('/payments/status'),

    cancel: () =>
        api.post('/payments/cancel'),
};

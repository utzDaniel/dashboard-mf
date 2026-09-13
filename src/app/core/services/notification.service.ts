import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';


@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private readonly messageService = inject(MessageService);

    error(
        error: any,
        defaultMessage = 'Ocorreu um erro inesperado'
    ): void {
        this.messageService.add({
            key: 'error',
            severity: 'error',
            summary: 'Erro',
            detail:
                error?.error?.message ??
                defaultMessage
        });
    }

    success(
        message: string
    ): void {
        this.messageService.add({
            key: 'success',
            severity: 'success',
            summary: 'Sucesso',
            detail: message
        });
    }

    warning(
        message: string
    ): void {
        this.messageService.add({
            key: 'warning',
            severity: 'warn',
            summary: 'Atenção',
            detail: message
        });
    }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface ChatbotRequest {
    message: string;
}

export interface ChatbotResponse {
    reply?: string;
    response?: string;
    answer?: string;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatbotService {
    private readonly apiUrl = '/api/chatbot';

    constructor(private readonly http: HttpClient) { }

    sendMessage(message: string): Observable<string> {
        return this.http.post<ChatbotResponse>(this.apiUrl, { message }).pipe(
            map((res) => res.reply || res.response || res.answer || res.message || 'No pude generar una respuesta.')
        );
    }
}
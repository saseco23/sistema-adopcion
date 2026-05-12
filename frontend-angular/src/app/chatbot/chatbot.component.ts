import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from './chatbot.service';

interface ChatMessage {
    role: 'user' | 'bot';
    text: string;
}

@Component({
    selector: 'app-chatbot',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chatbot.component.html',
    styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
    isOpen = false;
    message = '';
    isLoading = false;

    messages: ChatMessage[] = [
        {
            role: 'bot',
            text: 'Hola, soy el asistente de adopciones. Puedes preguntarme sobre mascotas, requisitos o el proceso de adopcion.'
        }
    ];

    constructor(private readonly chatbotService: ChatbotService) { }

    toggleChat(): void {
        this.isOpen = !this.isOpen;
    }

    sendMessage(): void {
        const text = this.message.trim();

        if (!text || this.isLoading) {
            return;
        }

        this.messages.push({ role: 'user', text });
        this.message = '';
        this.isLoading = true;

        this.chatbotService.sendMessage(text).subscribe({
            next: (reply) => {
                this.messages.push({ role: 'bot', text: reply });
                this.isLoading = false;
            },
            error: () => {
                this.messages.push({
                    role: 'bot',
                    text: 'Ahora no puedo conectarme con el servidor. Intenta de nuevo en unos minutos.'
                });
                this.isLoading = false;
            }
        });
    }
}
